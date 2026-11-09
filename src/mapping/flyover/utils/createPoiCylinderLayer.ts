/**
  File: createPoiCylinderLayer.ts | Author: Chace Nielson
  Date Created: Nov 9, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Draw closed, translucent POI cylinders at a uniform sea-level elevation.

  Usage:
  - FlyoverPoiLayer adds this custom layer to the existing MapLibre GL context.

  Notes:
  - Double-sided walls remain visible inside; terrain still occludes the volumes.
  - The top rim is 3D; side edges track the camera's tangent to each cylinder.
 */
import type { RefObject } from 'react'
import { MercatorCoordinate } from 'maplibre-gl'
import type { CustomLayerInterface } from 'maplibre-gl'
import {
  BufferGeometry,
  Camera,
  CylinderGeometry,
  DoubleSide,
  Float32BufferAttribute,
  LineBasicMaterial,
  LineLoop,
  LineSegments,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  Scene,
  Vector3,
  Vector4,
  WebGLRenderer,
} from 'three'
import type { MapPoi } from '../../components/MapPoiMarker'
import {
  FLYOVER_POI_CYLINDER_OPACITY,
  FLYOVER_POI_CYLINDER_OUTLINE_OPACITY,
  FLYOVER_POI_CYLINDER_OUTLINE_ENABLED,
  FLYOVER_POI_FADE_DURATION_MS,
} from '../../map-settings/flyoverPoiSettings'
import type { FlightState } from '../types'
import { FLYOVER_ENTER_DURATION } from '../../map-settings/flyoverSettings'
import { getAnimationDuration } from '../../map-functions/mapAnimationFunctions'
import { easeInOutCubic } from './flightMath'
import { getDistanceMeters } from './flightMath'
import {
  getPoiColor,
  getPoiOpacity,
  getPoiRadiusMeters,
  getPoiHeights,
} from './flightPoiGeometry'
import type { FlightPoiDepthLine } from './flightPoiLabelDepth'

export const POI_CYLINDER_LAYER_ID = 'flight-poi-cylinders'

export function createPoiCylinderLayer(
  pois: readonly MapPoi[],
  flightPositionRef: RefObject<FlightState | null>,
  opacities: Map<string, number>,
  entryStartedAt: number,
  onRender: (
    matrix: ArrayLike<number>,
    growth: number,
    outlines: readonly FlightPoiDepthLine[],
  ) => void,
): CustomLayerInterface {
  const scene = new Scene()
  const camera = new Camera()
  const geometry = new CylinderGeometry(1, 1, 1, 64)
  geometry.rotateX(Math.PI / 2)
  const rimGeometry = new BufferGeometry().setFromPoints(
    Array.from({ length: 64 }, (_, index) => {
      const angle = (index / 64) * Math.PI * 2
      return new Vector3(Math.cos(angle), Math.sin(angle), 0.5)
    }),
  )
  const inverseProjection = new Matrix4()
  const eye = new Vector4()
  const projected = new Vector4()
  const origin = MercatorCoordinate.fromLngLat(pois[0]?.coordinates ?? [0, 0])
  const unitsPerMeter = origin.meterInMercatorCoordinateUnits()
  const world = new Matrix4()
    .makeTranslation(origin.x, origin.y, 0)
    .scale(new Vector3(unitsPerMeter, -unitsPerMeter, unitsPerMeter))
  const volumes = pois.map((poi) => {
    const position = MercatorCoordinate.fromLngLat(poi.coordinates)
    const scale = position.meterInMercatorCoordinateUnits() / unitsPerMeter
    const radius = getPoiRadiusMeters(poi)
    const height = getPoiHeights(poi).cylinder
    const material = new MeshBasicMaterial({
      color: getPoiColor(poi),
      transparent: true,
      opacity: FLYOVER_POI_CYLINDER_OPACITY,
      side: DoubleSide,
      depthWrite: false,
    })
    const mesh = new Mesh(geometry, material)
    mesh.position.set(
      (position.x - origin.x) / unitsPerMeter,
      (origin.y - position.y) / unitsPerMeter,
      (height * scale) / 2,
    )
    mesh.scale.set(radius * scale, radius * scale, height * scale)
    const outlineMaterial = new LineBasicMaterial({
      color: '#000000',
      transparent: true,
      opacity: FLYOVER_POI_CYLINDER_OUTLINE_OPACITY,
      depthWrite: false,
    })
    const sidesGeometry = new BufferGeometry()
    const sidePositions = new Float32BufferAttribute(new Float32Array(12), 3)
    sidesGeometry.setAttribute('position', sidePositions)
    const sides = new LineSegments(sidesGeometry, outlineMaterial)
    // Tangent positions move every frame; avoid bounds cached from an earlier view.
    sides.frustumCulled = false
    const rim = new LineLoop(rimGeometry, outlineMaterial)
    rim.visible = FLYOVER_POI_CYLINDER_OUTLINE_ENABLED
    mesh.add(rim, sides)
    scene.add(mesh)
    return {
      poi,
      mesh,
      material,
      scale,
      outlineMaterial,
      sidesGeometry,
      sidePositions,
      sides,
    }
  })
  let renderer: WebGLRenderer | null = null
  let repaint: (() => void) | null = null
  let lastFrameAt = performance.now()
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  return {
    id: POI_CYLINDER_LAYER_ID,
    type: 'custom',
    renderingMode: '3d',
    onAdd(map, gl) {
      repaint = () => map.triggerRepaint()
      lastFrameAt = performance.now()
      renderer = new WebGLRenderer({
        canvas: map.getCanvas(),
        context: gl,
      })
      renderer.autoClear = false
    },
    render(_gl, { defaultProjectionData }) {
      const matrix = defaultProjectionData.mainMatrix
      camera.projectionMatrix.fromArray(matrix).multiply(world)
      inverseProjection.copy(camera.projectionMatrix).invert()
      // The inverse perspective projection maps this homogeneous point to the eye.
      eye.set(0, 0, 1, 0).applyMatrix4(inverseProjection)
      eye.divideScalar(eye.w)
      const flight = flightPositionRef.current
      const now = performance.now()
      const step =
        reducedMotion.matches || FLYOVER_POI_FADE_DURATION_MS <= 0
          ? 1
          : Math.min((now - lastFrameAt) / FLYOVER_POI_FADE_DURATION_MS, 1)
      lastFrameAt = now
      let isAnimating = false
      const duration = getAnimationDuration(FLYOVER_ENTER_DURATION)
      const growth =
        duration <= 0
          ? 1
          : easeInOutCubic(
              Math.min(Math.max((now - entryStartedAt) / duration, 0), 1),
            )
      if (growth < 1) isAnimating = true
      for (const {
        poi,
        mesh,
        material,
        scale,
        outlineMaterial,
        sidePositions,
        sides,
      } of volumes) {
        const distance = flight
          ? getDistanceMeters(
              [flight.longitude, flight.latitude],
              poi.coordinates,
            )
          : 0
        const height = getPoiHeights(poi).cylinder
        mesh.scale.z = Math.max(height * scale * growth, 0.001)
        mesh.position.z = mesh.scale.z / 2
        const target = flight ? getPoiOpacity(distance) : 0
        const previous = opacities.get(poi.id) ?? 1
        const opacity =
          previous +
          Math.sign(target - previous) *
            Math.min(Math.abs(target - previous), step)
        opacities.set(poi.id, opacity)
        if (opacity !== target) isAnimating = true
        mesh.visible = opacity > 0
        material.opacity = opacity * FLYOVER_POI_CYLINDER_OPACITY
        outlineMaterial.opacity = opacity * FLYOVER_POI_CYLINDER_OUTLINE_OPACITY
        const dx = eye.x - mesh.position.x
        const dy = eye.y - mesh.position.y
        const cameraDistance = Math.hypot(dx, dy)
        const radius = mesh.scale.x
        sides.visible =
          FLYOVER_POI_CYLINDER_OUTLINE_ENABLED && cameraDistance > radius
        if (sides.visible) {
          const direction = Math.atan2(dy, dx)
          const tangent = Math.acos(radius / cameraDistance)
          for (let side = 0; side < 2; side++) {
            const angle = direction + (side === 0 ? -tangent : tangent)
            const x = Math.cos(angle)
            const y = Math.sin(angle)
            sidePositions.setXYZ(side * 2, x, y, -0.5)
            sidePositions.setXYZ(side * 2 + 1, x, y, 0.5)
          }
          sidePositions.needsUpdate = true
        }
      }
      renderer?.resetState()
      renderer?.render(scene, camera)
      const outlines: FlightPoiDepthLine[] = []
      if (FLYOVER_POI_CYLINDER_OUTLINE_ENABLED) {
        for (const {
          poi,
          mesh,
          outlineMaterial,
          sidePositions,
          sides,
        } of volumes) {
          if (!mesh.visible) continue
          const projection = new Matrix4().multiplyMatrices(
            camera.projectionMatrix,
            mesh.matrixWorld,
          )
          const project = (
            positions: Pick<Float32BufferAttribute, 'getX' | 'getY' | 'getZ'>,
            index: number,
          ) => {
            projected
              .set(
                positions.getX(index),
                positions.getY(index),
                positions.getZ(index),
                1,
              )
              .applyMatrix4(projection)
            if (projected.w <= 0) return null
            return {
              x: projected.x / projected.w,
              y: projected.y / projected.w,
              z: projected.z / projected.w,
            }
          }
          const addLine = (
            positions: Pick<Float32BufferAttribute, 'getX' | 'getY' | 'getZ'>,
            from: number,
            to: number,
          ) => {
            const a = project(positions, from)
            const b = project(positions, to)
            if (a && b)
              outlines.push({
                id: poi.id,
                from: a,
                to: b,
                color: '#000000',
                opacity: outlineMaterial.opacity,
              })
          }
          const rimPositions = rimGeometry.getAttribute('position')
          for (let i = 0; i < rimPositions.count; i++)
            addLine(rimPositions, i, (i + 1) % rimPositions.count)
          if (sides.visible) {
            addLine(sidePositions, 0, 1)
            addLine(sidePositions, 2, 3)
          }
        }
      }
      onRender(matrix, growth, outlines)
      if (isAnimating) repaint?.()
    },
    onRemove() {
      geometry.dispose()
      rimGeometry.dispose()
      volumes.forEach(({ material, outlineMaterial, sidesGeometry }) => {
        material.dispose()
        outlineMaterial.dispose()
        sidesGeometry.dispose()
      })
      renderer?.dispose()
      renderer = null
      repaint = null
    },
  }
}
