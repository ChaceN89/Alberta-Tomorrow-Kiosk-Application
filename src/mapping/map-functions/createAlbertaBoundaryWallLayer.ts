/**
  File: createAlbertaBoundaryWallLayer.ts | Author: Chace Nielson
  Date Created: Nov 9, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Raise the Alberta boundary into translucent walls with an outlined top rim.

  Usage:
  - Added alongside the existing boundary by mapLayerFunctions in both map modes.

  Notes:
  - Reuses the boundary source and POI cylinder opacity without another data request.
  - Tops follow smoothed terrain; buried bottoms preserve terrain occlusion.
 */
import type { GeoJSON, Position } from 'geojson'
import { MercatorCoordinate } from 'maplibre-gl'
import type {
  CustomLayerInterface,
  GeoJSONSource,
  Map as MapLibreMap,
} from 'maplibre-gl'
import {
  BufferGeometry,
  Camera,
  DoubleSide,
  Float32BufferAttribute,
  LineBasicMaterial,
  LineSegments,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three'
import {
  ALBERTA_BOUNDARY_COLOR,
  ALBERTA_BOUNDARY_SOURCE_ID,
  ALBERTA_BOUNDARY_WALL_HEIGHT_METERS,
  ALBERTA_BOUNDARY_WALL_LAYER_ID,
  ALBERTA_BOUNDARY_WALL_SAMPLE_METERS,
  ALBERTA_BOUNDARY_WALL_SMOOTHING_METERS,
} from '../map-settings/mapSettings'
import { getDistanceMeters } from '../flyover/utils/flightMath'
import { smoothBoundaryTerrain } from './boundaryTerrainProfile'
import { TERRAIN_SOURCE_ID } from '../map-settings/terrainSettings'
import {
  FLYOVER_POI_CYLINDER_OPACITY,
  FLYOVER_POI_CYLINDER_OUTLINE_OPACITY,
} from '../map-settings/flyoverPoiSettings'

function getBoundaryRings(data: GeoJSON): Position[][] {
  switch (data.type) {
    case 'FeatureCollection':
      return data.features.flatMap(getBoundaryRings)
    case 'Feature':
      return data.geometry ? getBoundaryRings(data.geometry) : []
    case 'GeometryCollection':
      return data.geometries.flatMap(getBoundaryRings)
    case 'Polygon':
      return data.coordinates
    case 'MultiPolygon':
      return data.coordinates.flat()
    default:
      throw new Error(`Unsupported Alberta boundary geometry: ${data.type}`)
  }
}

export function createAlbertaBoundaryWallLayer(): CustomLayerInterface {
  const scene = new Scene()
  const camera = new Camera()
  const wallGeometry = new BufferGeometry()
  const rimGeometry = new BufferGeometry()
  const wallMaterial = new MeshBasicMaterial({
    color: ALBERTA_BOUNDARY_COLOR,
    transparent: true,
    opacity: FLYOVER_POI_CYLINDER_OPACITY,
    side: DoubleSide,
    depthWrite: false,
  })
  const rimMaterial = new LineBasicMaterial({
    color: '#000000',
    transparent: true,
    opacity: FLYOVER_POI_CYLINDER_OUTLINE_OPACITY,
    depthWrite: false,
  })
  const origin = MercatorCoordinate.fromLngLat([-115, 55])
  const unitsPerMeter = origin.meterInMercatorCoordinateUnits()
  const world = new Matrix4()
    .makeTranslation(origin.x, origin.y, 0)
    .scale(new Vector3(unitsPerMeter, -unitsPerMeter, unitsPerMeter))
  let renderer: WebGLRenderer | null = null
  let removed = false
  let mapInstance: MapLibreMap | null = null
  let lastTerrainUpdate = -Infinity
  let terrainTimer: ReturnType<typeof setTimeout> | null = null
  let detachTerrainEvents: (() => void) | null = null
  const profiles: {
    coordinates: [number, number][]
    points: number[][]
    distances: number[]
    samples: number[]
    perimeter: number
  }[] = []

  const updateTerrain = () => {
    const map = mapInstance
    if (!map || profiles.length === 0) return
    const walls: number[] = []
    const rim: number[] = []
    for (const profile of profiles) {
      const { coordinates, points, distances, samples, perimeter } = profile
      const terrainEnabled = !!map.getTerrain()
      const elevations = samples.map((index) =>
        terrainEnabled
          ? (map.queryTerrainElevation(coordinates[index]) ?? 0)
          : 0,
      )
      const smoothed = smoothBoundaryTerrain(
        samples.map((index) => distances[index]),
        elevations,
        perimeter,
        ALBERTA_BOUNDARY_WALL_SMOOTHING_METERS,
      )
      let sample = 0
      for (let index = 0; index < points.length; index++) {
        while (
          sample + 1 < samples.length &&
          distances[samples[sample + 1]] <= distances[index]
        )
          sample++
        const next = (sample + 1) % samples.length
        const start = distances[samples[sample]]
        const end = next === 0 ? perimeter : distances[samples[next]]
        const blend =
          end > start ? (distances[index] - start) / (end - start) : 0
        const ground =
          smoothed[sample] + (smoothed[next] - smoothed[sample]) * blend
        const position = MercatorCoordinate.fromLngLat(
          coordinates[index],
          ground + ALBERTA_BOUNDARY_WALL_HEIGHT_METERS,
        )
        points[index][2] = position.z / unitsPerMeter
      }
      for (let index = 1; index < points.length; index++) {
        const a = points[index - 1]
        const b = points[index]
        walls.push(
          a[0],
          a[1],
          0,
          b[0],
          b[1],
          0,
          ...a,
          ...a,
          b[0],
          b[1],
          0,
          ...b,
        )
        rim.push(...a, ...b)
      }
    }
    const updatePositions = (geometry: BufferGeometry, values: number[]) => {
      const attribute = geometry.getAttribute('position')
      if (attribute && attribute.count * 3 === values.length) {
        attribute.array.set(values)
        attribute.needsUpdate = true
      } else {
        geometry.setAttribute('position', new Float32BufferAttribute(values, 3))
      }
      geometry.computeBoundingSphere()
    }
    updatePositions(wallGeometry, walls)
    updatePositions(rimGeometry, rim)
  }

  return {
    id: ALBERTA_BOUNDARY_WALL_LAYER_ID,
    type: 'custom',
    renderingMode: '3d',
    onAdd(map, gl) {
      mapInstance = map
      removed = false
      renderer = new WebGLRenderer({ canvas: map.getCanvas(), context: gl })
      renderer.autoClear = false
      const source = map.getSource<GeoJSONSource>(ALBERTA_BOUNDARY_SOURCE_ID)
      if (!source) throw new Error('Alberta boundary source is missing.')
      const scheduleTerrainUpdate = () => {
        if (terrainTimer !== null) return
        terrainTimer = setTimeout(() => {
          terrainTimer = null
          if (removed) return
          updateTerrain()
          map.triggerRepaint()
        }, 500)
      }
      const onSourceData = (event: { sourceId: string }) => {
        if (event.sourceId === TERRAIN_SOURCE_ID) scheduleTerrainUpdate()
      }
      map.on('sourcedata', onSourceData)
      map.on('terrain', scheduleTerrainUpdate)
      map.on('moveend', scheduleTerrainUpdate)
      detachTerrainEvents = () => {
        map.off('sourcedata', onSourceData)
        map.off('terrain', scheduleTerrainUpdate)
        map.off('moveend', scheduleTerrainUpdate)
      }
      void source
        .getData()
        .then((data) => {
          if (removed) return
          for (const ring of getBoundaryRings(data)) {
            const detailedRing: Position[] = []
            for (let index = 0; index < ring.length; index++) {
              const from = ring[index]
              if (!Number.isFinite(from[0]) || !Number.isFinite(from[1]))
                throw new Error('Invalid Alberta boundary coordinates.')
              if (index > 0) {
                const previous = ring[index - 1]
                const segments = Math.ceil(
                  getDistanceMeters(
                    [previous[0], previous[1]],
                    [from[0], from[1]],
                  ) / ALBERTA_BOUNDARY_WALL_SAMPLE_METERS,
                )
                for (let step = 1; step < segments; step++)
                  detailedRing.push([
                    previous[0] + ((from[0] - previous[0]) * step) / segments,
                    previous[1] + ((from[1] - previous[1]) * step) / segments,
                  ])
              }
              detailedRing.push(from)
            }
            const coordinates: [number, number][] = []
            const distances: number[] = []
            const samples: number[] = []
            let distance = 0
            const points = detailedRing.map(([longitude, latitude]) => {
              if (!Number.isFinite(longitude) || !Number.isFinite(latitude))
                throw new Error('Invalid Alberta boundary coordinates.')
              const coordinate: [number, number] = [longitude, latitude]
              if (coordinates.length > 0)
                distance += getDistanceMeters(
                  coordinates[coordinates.length - 1],
                  coordinate,
                )
              if (
                samples.length === 0 ||
                distance - distances[samples[samples.length - 1]] >=
                  ALBERTA_BOUNDARY_WALL_SAMPLE_METERS
              )
                samples.push(coordinates.length)
              distances.push(distance)
              coordinates.push(coordinate)
              const point = MercatorCoordinate.fromLngLat(
                [longitude, latitude],
                ALBERTA_BOUNDARY_WALL_HEIGHT_METERS,
              )
              return [
                (point.x - origin.x) / unitsPerMeter,
                (origin.y - point.y) / unitsPerMeter,
                point.z / unitsPerMeter,
              ]
            })
            // The final coordinate repeats the first; avoid duplicate seam samples.
            if (samples.at(-1) === points.length - 1) samples.pop()
            profiles.push({
              coordinates,
              points,
              distances,
              samples,
              perimeter: distance,
            })
          }
          if (!profiles.some(({ points }) => points.length > 1))
            throw new Error('Alberta boundary contains no polygon edges.')
          updateTerrain()
          scene.add(
            new Mesh(wallGeometry, wallMaterial),
            new LineSegments(rimGeometry, rimMaterial),
          )
          map.triggerRepaint()
        })
        .catch((error: unknown) => {
          if (!removed)
            map.fire('error', {
              error: error instanceof Error ? error : new Error(String(error)),
            })
        })
    },
    render(_gl, { defaultProjectionData }) {
      if (!renderer || scene.children.length === 0) return
      const now = performance.now()
      if (now - lastTerrainUpdate >= 500) {
        lastTerrainUpdate = now
        updateTerrain()
      }
      camera.projectionMatrix
        .fromArray(defaultProjectionData.mainMatrix)
        .multiply(world)
      renderer.resetState()
      renderer.render(scene, camera)
    },
    onRemove() {
      removed = true
      mapInstance = null
      detachTerrainEvents?.()
      if (terrainTimer !== null) clearTimeout(terrainTimer)
      wallGeometry.dispose()
      rimGeometry.dispose()
      wallMaterial.dispose()
      rimMaterial.dispose()
      renderer?.dispose()
      renderer = null
    },
  }
}
