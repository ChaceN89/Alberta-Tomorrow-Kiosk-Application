/**
  File: FlyoverPoiLayer.tsx | Author: Chace Nielson
  Date Created: Nov 9, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Render flight POI cylinders and elevated, distance-faded marker buttons.

  Usage:
  - Rendered inside AlbertaMapCanvas only while flyover is active.

  Notes:
  - Labels and cylinders share sea-level heights and plane-distance fading.
  - The volume renderer shares MapLibre's GL context and frame loop.
 */
import { useEffect, useEffectEvent, useRef } from 'react'
import type { RefObject } from 'react'
import { createPortal } from 'react-dom'
import { useMap } from 'react-map-gl/maplibre'
import { MercatorCoordinate } from 'maplibre-gl'
import { Matrix4, Vector4 } from 'three'
import { MapPoiMarkerButton, type MapPoi } from '../../components/MapPoiMarker'
import type { FlightState } from '../types'
import { FLYOVER_POI_INSIDE_TINT_OPACITY } from '../../map-settings/flyoverPoiSettings'
import {
  getPoiColor,
  getPoiHeights,
  getPoiRadiusMeters,
} from '../utils/flightPoiGeometry'
import {
  createPoiCylinderLayer,
  POI_CYLINDER_LAYER_ID,
} from '../utils/createPoiCylinderLayer'
import { getDistanceMeters } from '../utils/flightMath'
import {
  createPoiLabelDepthPainter,
  type FlightPoiDepthLine,
} from '../utils/flightPoiLabelDepth'
import {
  layoutFlightPoiLabels,
  type FlightPoiLabelBounds,
  type FlightPoiLabelOffset,
} from '../utils/flightPoiLabelLayout'

type FlyoverPoiLayerProps = {
  pois: readonly MapPoi[]
  flightPositionRef: RefObject<FlightState | null>
  activePoiId: string | null
  infoPoiId: string | null
  onPoiActivate: (poi: MapPoi, origin?: Element | null) => void
}

export function FlyoverPoiLayer({
  pois,
  flightPositionRef,
  activePoiId,
  infoPoiId,
  onPoiActivate,
}: FlyoverPoiLayerProps) {
  const { current: mapRef } = useMap()
  const elements = useRef(new Map<string, HTMLDivElement>())
  const tethers = useRef(new Map<string, SVGLineElement>())
  const depthCanvases = useRef(new Map<string, HTMLCanvasElement>())
  const opacities = useRef(new Map<string, number>())
  const entryStartedAt = useRef<number | null>(null)
  const labelOffsets = useRef(new Map<string, FlightPoiLabelOffset>())
  const tintRef = useRef<HTMLDivElement>(null)
  const overlayHost = mapRef?.getMap().getContainer().parentElement
  const getInfoPoiId = useEffectEvent(() => infoPoiId)
  const getActivePoiId = useEffectEvent(() => activePoiId)

  useEffect(() => {
    const map = mapRef?.getMap()
    if (!map) return
    entryStartedAt.current ??= performance.now()
    const matrix = new Matrix4()
    const projected = new Vector4()
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let lastLayoutAt = performance.now()
    const renderLabels = (
      projection: ArrayLike<number>,
      growth: number,
      outlines: readonly FlightPoiDepthLine[],
    ) => {
      matrix.fromArray(projection)
      const flight = flightPositionRef.current
      const depthOrder = [...pois].sort((a, b) => {
        if (!flight) return 0
        const position: [number, number] = [flight.longitude, flight.latitude]
        return (
          getDistanceMeters(position, b.coordinates) -
          getDistanceMeters(position, a.coordinates)
        )
      })
      depthOrder.forEach((poi, index) => {
        elements.current
          .get(poi.id)
          ?.style.setProperty('--z-poi-depth-order', String(index))
      })
      let insidePoi: MapPoi | null = null
      const width = map.getCanvas().clientWidth
      const height = map.getCanvas().clientHeight
      const depthLines: FlightPoiDepthLine[] = [...outlines]
      const labels: {
        canvas: HTMLCanvasElement
        id: string
        left: number
        top: number
        width: number
        height: number
        depth: number
      }[] = []
      const tetherColor = getComputedStyle(map.getContainer())
        .getPropertyValue('--color-pine')
        .trim()
      const pauseBadge = map
        .getContainer()
        .parentElement?.querySelector('.plane-hud__pause')
      const minimumTop = pauseBadge
        ? pauseBadge.getBoundingClientRect().bottom -
          map.getCanvas().getBoundingClientRect().top +
          12
        : 16
      const bounds: FlightPoiLabelBounds[] = []
      for (const poi of pois) {
        const element = elements.current.get(poi.id)
        if (!element || (opacities.current.get(poi.id) ?? 0) <= 0) continue
        const ground = map.queryTerrainElevation(poi.coordinates) ?? 0
        const position = MercatorCoordinate.fromLngLat(
          poi.coordinates,
          ground + (getPoiHeights(poi).marker - ground) * growth,
        )
        projected
          .set(position.x, position.y, position.z, 1)
          .applyMatrix4(matrix)
        const x = ((projected.x / projected.w + 1) * width) / 2
        const y = ((1 - projected.y / projected.w) * height) / 2
        if (
          projected.w <= 0 ||
          x <= -200 ||
          x >= width + 200 ||
          y >= height + 100
        )
          continue
        bounds.push({
          id: poi.id,
          x,
          bottom: Math.max(minimumTop + element.offsetHeight, y),
          width: element.offsetWidth,
          height: element.offsetHeight,
          priority:
            poi.id === getInfoPoiId() ? 2 : poi.id === getActivePoiId() ? 1 : 0,
          depth: projected.z / projected.w,
        })
      }
      const now = performance.now()
      if (growth < 1) labelOffsets.current.clear()
      if (
        growth >= 1 &&
        layoutFlightPoiLabels(
          bounds,
          labelOffsets.current,
          width,
          now - lastLayoutAt,
          reducedMotion.matches,
          minimumTop,
        )
      )
        map.triggerRepaint()
      lastLayoutAt = now
      for (const poi of pois) {
        const element = elements.current.get(poi.id)
        if (!element) continue
        const opacity = opacities.current.get(poi.id) ?? 0
        const distance = flight
          ? getDistanceMeters(
              [flight.longitude, flight.latitude],
              poi.coordinates,
            )
          : 0
        if (
          flight &&
          distance <= getPoiRadiusMeters(poi) + 0.01 &&
          (!insidePoi || poi.id === getInfoPoiId())
        )
          insidePoi = poi
        const groundElevation = map.queryTerrainElevation(poi.coordinates) ?? 0
        const markerElevation =
          groundElevation +
          (getPoiHeights(poi).marker - groundElevation) * growth
        const point = MercatorCoordinate.fromLngLat(
          poi.coordinates,
          markerElevation,
        )
        projected.set(point.x, point.y, point.z, 1).applyMatrix4(matrix)
        const anchorX = ((projected.x / projected.w + 1) * width) / 2
        const x = anchorX + (labelOffsets.current.get(poi.id)?.current ?? 0)
        const y = ((1 - projected.y / projected.w) * height) / 2
        const labelDepth = projected.z / projected.w
        const visible =
          opacity > 0 &&
          projected.w > 0 &&
          anchorX > -200 &&
          anchorX < width + 200 &&
          y < height + 100
        element.style.visibility = visible ? 'visible' : 'hidden'
        const markerBottom = Math.max(
          minimumTop + element.offsetHeight,
          Math.max(minimumTop + element.offsetHeight, y) -
            (labelOffsets.current.get(poi.id)?.lift ?? 0),
        )
        element.style.transform = `translate(${x}px, ${markerBottom}px) translate(-50%, -100%)`
        element.style.opacity = String(opacity)
        const depthCanvas = depthCanvases.current.get(poi.id)
        if (visible && depthCanvas) {
          labels.push({
            canvas: depthCanvas,
            id: poi.id,
            left: x - element.offsetWidth / 2,
            top: markerBottom - element.offsetHeight,
            width: element.offsetWidth,
            height: element.offsetHeight,
            depth: labelDepth,
          })
        }
        const tether = tethers.current.get(poi.id)
        if (tether) {
          const ground = MercatorCoordinate.fromLngLat(
            poi.coordinates,
            groundElevation,
          )
          projected.set(ground.x, ground.y, ground.z, 1).applyMatrix4(matrix)
          const groundVisible = projected.w > 0
          tether.style.visibility =
            visible && groundVisible && markerElevation > groundElevation
              ? 'visible'
              : 'hidden'
          tether.setAttribute('x1', String(x))
          tether.setAttribute('y1', String(markerBottom))
          tether.setAttribute(
            'x2',
            String(((projected.x / projected.w + 1) * width) / 2),
          )
          tether.setAttribute(
            'y2',
            String(((1 - projected.y / projected.w) * height) / 2),
          )
          tether.style.opacity = String(opacity)
          if (visible && groundVisible && markerElevation > groundElevation) {
            depthLines.push({
              id: poi.id,
              from: {
                x: (x / width) * 2 - 1,
                y: 1 - (markerBottom / height) * 2,
                z: labelDepth,
              },
              to: {
                x: projected.x / projected.w,
                y: projected.y / projected.w,
                z: projected.z / projected.w,
              },
              color: tetherColor,
              opacity,
              dashed: true,
            })
          }
        }
      }
      const paintDepth = createPoiLabelDepthPainter(
        pois,
        opacities.current,
        matrix,
        growth,
        width,
        height,
        depthLines,
      )
      for (const label of labels)
        paintDepth(
          label.canvas,
          label.id,
          label.left,
          label.top,
          label.width,
          label.height,
          label.depth,
        )
      const tint = tintRef.current
      if (tint) {
        tint.style.opacity = insidePoi
          ? String(FLYOVER_POI_INSIDE_TINT_OPACITY)
          : '0'
        tint.style.backgroundColor = insidePoi ? getPoiColor(insidePoi) : ''
        tint.dataset.poiId = insidePoi?.id ?? ''
      }
    }
    const addProjection = () => {
      if (!map.getLayer(POI_CYLINDER_LAYER_ID))
        map.addLayer(
          createPoiCylinderLayer(
            pois,
            flightPositionRef,
            opacities.current,
            entryStartedAt.current ?? performance.now(),
            renderLabels,
          ),
        )
    }
    addProjection()
    map.on('style.load', addProjection)
    const markerElements = elements.current
    const tetherElements = tethers.current
    return () => {
      map.off('style.load', addProjection)
      if (map.getLayer(POI_CYLINDER_LAYER_ID))
        map.removeLayer(POI_CYLINDER_LAYER_ID)
      markerElements.forEach((element) => {
        element.style.visibility = 'hidden'
      })
      tetherElements.forEach((element) => {
        element.style.visibility = 'hidden'
      })
    }
  }, [flightPositionRef, mapRef, pois])

  return (
    <>
      <svg className="mapping-flight-poi-tethers" aria-hidden="true">
        {pois.map((poi) => (
          <line
            key={poi.id}
            data-poi-id={poi.id}
            ref={(element) => {
              if (element) tethers.current.set(poi.id, element)
              else tethers.current.delete(poi.id)
            }}
          />
        ))}
      </svg>
      {overlayHost &&
        createPortal(
          <div
            ref={tintRef}
            className="mapping-flight-poi-tint"
            aria-hidden="true"
          />,
          overlayHost,
        )}
      <div className="mapping-flight-poi-markers">
        {pois.map((poi) => (
          <div
            key={poi.id}
            className="mapping-flight-poi"
            ref={(element) => {
              if (element) elements.current.set(poi.id, element)
              else elements.current.delete(poi.id)
            }}
          >
            <MapPoiMarkerButton
              {...poi}
              isActive={poi.id === activePoiId}
              isInfoOpen={poi.id === infoPoiId}
              onActivate={(origin) => onPoiActivate(poi, origin)}
            />
            <canvas
              className="mapping-flight-poi__depth"
              aria-hidden="true"
              ref={(canvas) => {
                if (canvas) depthCanvases.current.set(poi.id, canvas)
                else depthCanvases.current.delete(poi.id)
              }}
            />
          </div>
        ))}
      </div>
    </>
  )
}
