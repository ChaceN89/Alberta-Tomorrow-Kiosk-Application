/**
  File: flightPoiLabelDepth.ts | Author: Chace Nielson
  Date Created: Nov 9, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Composite foreground cylinder surfaces, outlines, and tethers over labels.

  Usage:
  - Build once per map frame and paint each label's pointer-transparent canvas.

  Notes:
  - Rays stop at label depth, so cylinders behind the label never tint it.
 */
import { MercatorCoordinate } from 'maplibre-gl'
import { Color, Matrix4, Vector4 } from 'three'
import type { MapPoi } from '../../components/MapPoiMarker'
import { FLYOVER_POI_CYLINDER_OPACITY } from '../../map-settings/flyoverPoiSettings'
import {
  getPoiColor,
  getPoiHeights,
  getPoiRadiusMeters,
} from './flightPoiGeometry'

type Surface = { depth: number; color: Color; opacity: number }

export type FlightPoiDepthPoint = { x: number; y: number; z: number }
export type FlightPoiDepthLine = {
  id: string
  from: FlightPoiDepthPoint
  to: FlightPoiDepthPoint
  color: string
  opacity: number
  dashed?: boolean
}

export function createPoiLabelDepthPainter(
  pois: readonly MapPoi[],
  opacities: ReadonlyMap<string, number>,
  matrix: Matrix4,
  growth: number,
  viewportWidth: number,
  viewportHeight: number,
  depthLines: readonly FlightPoiDepthLine[] = [],
  activePoiId: string | null = null,
) {
  const inverse = matrix.clone().invert()
  const point = new Vector4()
  const start = new Vector4()
  const end = new Vector4()
  const lines = depthLines.map((line) => {
    const from = {
      x: ((line.from.x + 1) * viewportWidth) / 2,
      y: ((1 - line.from.y) * viewportHeight) / 2,
    }
    const to = {
      x: ((line.to.x + 1) * viewportWidth) / 2,
      y: ((1 - line.to.y) * viewportHeight) / 2,
    }
    return {
      ...line,
      from: { ...line.from, ...from },
      to: { ...line.to, ...to },
      color: new Color(line.color).convertLinearToSRGB(),
      left: Math.min(from.x, to.x) - 2,
      right: Math.max(from.x, to.x) + 2,
      top: Math.min(from.y, to.y) - 2,
      bottom: Math.max(from.y, to.y) + 2,
    }
  })
  const cylinders = pois.flatMap((poi) => {
    const opacity = (opacities.get(poi.id) ?? 0) * FLYOVER_POI_CYLINDER_OPACITY
    if (opacity <= 0 || growth <= 0) return []
    const center = MercatorCoordinate.fromLngLat(poi.coordinates)
    const units = center.meterInMercatorCoordinateUnits()
    const radius = getPoiRadiusMeters(poi) * units
    const height = getPoiHeights(poi).cylinder * growth * units
    let left = Infinity
    let right = -Infinity
    let top = Infinity
    let bottom = -Infinity
    let crossesCamera = false
    for (let i = 0; i < 64; i++) {
      const angle = (i / 64) * Math.PI * 2
      for (const z of [0, height]) {
        point
          .set(
            center.x + radius * Math.cos(angle),
            center.y + radius * Math.sin(angle),
            z,
            1,
          )
          .applyMatrix4(matrix)
        if (point.w <= 0) {
          crossesCamera = true
          continue
        }
        const x = ((point.x / point.w + 1) * viewportWidth) / 2
        const y = ((1 - point.y / point.w) * viewportHeight) / 2
        left = Math.min(left, x)
        right = Math.max(right, x)
        top = Math.min(top, y)
        bottom = Math.max(bottom, y)
      }
    }
    return [
      {
        id: poi.id,
        center,
        radius,
        height,
        opacity,
        color: new Color(
          getPoiColor(poi, poi.id === activePoiId),
        ).convertLinearToSRGB(),
        left: crossesCamera ? -Infinity : left - 1,
        right: crossesCamera ? Infinity : right + 1,
        top: crossesCamera ? -Infinity : top - 1,
        bottom: crossesCamera ? Infinity : bottom + 1,
      },
    ]
  })

  return (
    canvas: HTMLCanvasElement,
    poiId: string,
    left: number,
    top: number,
    width: number,
    height: number,
    labelDepth: number,
  ) => {
    const context = canvas.getContext('2d')
    if (!context)
      throw new Error('Unable to create the flight POI depth canvas.')
    const pixelWidth = Math.ceil(width)
    const pixelHeight = Math.ceil(height)
    if (canvas.width !== pixelWidth) canvas.width = pixelWidth
    if (canvas.height !== pixelHeight) canvas.height = pixelHeight
    context.clearRect(0, 0, pixelWidth, pixelHeight)
    const candidates = cylinders.filter(
      (cylinder) =>
        cylinder.id !== poiId &&
        cylinder.left < left + width &&
        cylinder.right > left &&
        cylinder.top < top + height &&
        cylinder.bottom > top,
    )
    const lineCandidates = lines.filter(
      (line) =>
        line.id !== poiId &&
        line.left < left + width &&
        line.right > left &&
        line.top < top + height &&
        line.bottom > top,
    )
    if (!candidates.length && !lineCandidates.length) return
    const pixels = context.createImageData(pixelWidth, pixelHeight)
    const surfaces: Surface[] = []
    for (let y = 0; y < pixelHeight; y++) {
      for (let x = 0; x < pixelWidth; x++) {
        const screenX = left + x + 0.5
        const screenY = top + y + 0.5
        const ndcX = (screenX / viewportWidth) * 2 - 1
        const ndcY = 1 - (screenY / viewportHeight) * 2
        start.set(ndcX, ndcY, -1, 1).applyMatrix4(inverse)
        start.divideScalar(start.w)
        end.set(ndcX, ndcY, labelDepth, 1).applyMatrix4(inverse)
        end.divideScalar(end.w)
        const dx = end.x - start.x
        const dy = end.y - start.y
        const dz = end.z - start.z
        surfaces.length = 0
        for (const cylinder of candidates) {
          if (
            screenX < cylinder.left ||
            screenX > cylinder.right ||
            screenY < cylinder.top ||
            screenY > cylinder.bottom
          )
            continue
          const ox = start.x - cylinder.center.x
          const oy = start.y - cylinder.center.y
          const a = dx * dx + dy * dy
          const b = 2 * (ox * dx + oy * dy)
          const c = ox * ox + oy * oy - cylinder.radius ** 2
          const discriminant = b * b - 4 * a * c
          const hits: number[] = []
          if (a > 0 && discriminant > 0) {
            const root = Math.sqrt(discriminant)
            for (const depth of [
              (-b - root) / (2 * a),
              (-b + root) / (2 * a),
            ]) {
              const z = start.z + depth * dz
              if (z > 0 && z < cylinder.height) hits.push(depth)
            }
          }
          if (dz !== 0) {
            for (const z of [0, cylinder.height]) {
              const depth = (z - start.z) / dz
              if (
                (ox + depth * dx) ** 2 + (oy + depth * dy) ** 2 <
                cylinder.radius ** 2
              )
                hits.push(depth)
            }
          }
          for (const depth of hits) {
            if (depth > 0 && depth < 1) {
              point
                .set(
                  start.x + depth * dx,
                  start.y + depth * dy,
                  start.z + depth * dz,
                  1,
                )
                .applyMatrix4(matrix)
              surfaces.push({
                depth: point.z / point.w,
                color: cylinder.color,
                opacity: cylinder.opacity,
              })
            }
          }
        }
        for (const line of lineCandidates) {
          if (
            screenX < line.left ||
            screenX > line.right ||
            screenY < line.top ||
            screenY > line.bottom
          )
            continue
          const dx = line.to.x - line.from.x
          const dy = line.to.y - line.from.y
          const lengthSquared = dx * dx + dy * dy
          if (lengthSquared === 0) continue
          let along = Math.max(
            0,
            Math.min(
              1,
              ((screenX - line.from.x) * dx + (screenY - line.from.y) * dy) /
                lengthSquared,
            ),
          )
          if (line.dashed) {
            const length = Math.sqrt(lengthSquared)
            const distance = along * length
            // Match the SVG's 1px dash, 6px gap, and round 2px stroke.
            const dashStart = Math.floor(distance / 7) * 7
            const nearest = Math.min(dashStart + 1, distance)
            const next = dashStart + 7
            along =
              (distance - nearest < next - distance
                ? nearest
                : Math.min(next, length)) / length
          }
          const distance = Math.hypot(
            screenX - line.from.x - along * dx,
            screenY - line.from.y - along * dy,
          )
          const coverage = Math.max(
            0,
            Math.min(1, (line.dashed ? 1.5 : 1) - distance),
          )
          const depth = line.from.z + along * (line.to.z - line.from.z)
          if (coverage > 0 && depth >= -1 && depth < labelDepth)
            surfaces.push({
              depth,
              color: line.color,
              opacity: line.opacity * coverage,
            })
        }
        surfaces.sort((a, b) => b.depth - a.depth)
        let red = 0
        let green = 0
        let blue = 0
        let alpha = 0
        for (const { color, opacity } of surfaces) {
          red = color.r * opacity + red * (1 - opacity)
          green = color.g * opacity + green * (1 - opacity)
          blue = color.b * opacity + blue * (1 - opacity)
          alpha = opacity + alpha * (1 - opacity)
        }
        if (alpha === 0) continue
        const index = (y * pixelWidth + x) * 4
        pixels.data[index] = (red / alpha) * 255
        pixels.data[index + 1] = (green / alpha) * 255
        pixels.data[index + 2] = (blue / alpha) * 255
        pixels.data[index + 3] = alpha * 255
      }
    }
    // Clip to the existing bubble and tail rather than tinting the map twice.
    const rootFontSize = parseFloat(getComputedStyle(canvas).fontSize)
    const tailHeight = rootFontSize * 0.875
    const tailWidth = rootFontSize * 1.75
    context.putImageData(pixels, 0, 0)
    context.save()
    context.globalCompositeOperation = 'destination-in'
    context.beginPath()
    context.roundRect(0, 0, width, height - tailHeight, rootFontSize)
    context.moveTo((width - tailWidth) / 2, height - rootFontSize)
    context.lineTo((width + tailWidth) / 2, height - rootFontSize)
    context.lineTo(width / 2, height)
    context.closePath()
    context.fill()
    context.restore()
  }
}
