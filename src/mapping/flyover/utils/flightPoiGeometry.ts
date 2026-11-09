/**
  File: flightPoiGeometry.ts | Author: Chace Nielson
  Date Created: Nov 9, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Share POI radius, color, fading, and swept horizontal flight entry calculations.

  Usage:
  - Shared by the cylinder renderer and flight POI interaction hook.

  Notes:
  - Swept detection catches a cylinder even when a fast frame crosses it entirely.
 */
import type { MapPoi } from '../../components/MapPoiMarker'
import {
  FLYOVER_POI_COLORS,
  FLYOVER_POI_ENTRY_DISTANCE_METERS,
  FLYOVER_POI_FADE_DISTANCE_METERS,
  FLYOVER_POI_RADIUS_METERS,
  FLYOVER_POI_HEIGHT_METERS,
  FLYOVER_POI_HEIGHT_ABOVE_CYLINDER_METERS,
} from '../../map-settings/flyoverPoiSettings'
import {
  degreesToRadians,
  clamp,
  getBearingDegrees,
  getDistanceMeters,
} from './flightMath'

export function getPoiRadiusMeters(
  poi: Pick<MapPoi, 'id' | 'flyoverRadiusMultiplier'>,
) {
  const multiplier = poi.flyoverRadiusMultiplier ?? 1
  if (!Number.isFinite(multiplier) || multiplier <= 0) {
    throw new Error(
      `POI "${poi.id}" must have a positive, finite flyoverRadiusMultiplier.`,
    )
  }
  return FLYOVER_POI_RADIUS_METERS * multiplier
}

export function getPoiColor(
  poi: Pick<MapPoi, 'isModulePoi' | 'isComplete'>,
  isActive = false,
) {
  if (isActive) return FLYOVER_POI_COLORS.active
  return poi.isModulePoi
    ? poi.isComplete
      ? FLYOVER_POI_COLORS.complete
      : FLYOVER_POI_COLORS.module
    : FLYOVER_POI_COLORS.base
}

export function getPoiOpacity(distance: number) {
  return (
    1 -
    clamp(
      (distance - FLYOVER_POI_FADE_DISTANCE_METERS) /
        (FLYOVER_POI_ENTRY_DISTANCE_METERS - FLYOVER_POI_FADE_DISTANCE_METERS),
      0,
      1,
    )
  )
}

export function getPoiHeights(
  poi: Pick<MapPoi, 'id' | 'flyoverCylinderHeightMultiplier'>,
) {
  const heightMultiplier = poi.flyoverCylinderHeightMultiplier ?? 1
  if (!Number.isFinite(heightMultiplier) || heightMultiplier <= 0) {
    throw new Error(
      `POI "${poi.id}" must have a positive, finite flyoverCylinderHeightMultiplier.`,
    )
  }
  const cylinder = FLYOVER_POI_HEIGHT_METERS * heightMultiplier
  return {
    cylinder,
    marker: cylinder + FLYOVER_POI_HEIGHT_ABOVE_CYLINDER_METERS,
  }
}

export function getCylinderEntry(
  from: [number, number],
  to: [number, number],
  center: [number, number],
  radius = FLYOVER_POI_RADIUS_METERS,
): number | null {
  const distance = getDistanceMeters(center, from)
  if (distance <= radius) return 0
  const heading = degreesToRadians(getBearingDegrees(center, from))
  const x = Math.sin(heading) * distance
  const y = Math.cos(heading) * distance
  const segmentDistance = getDistanceMeters(from, to)
  if (segmentDistance === 0) return null
  const segmentHeading = degreesToRadians(getBearingDegrees(from, to))
  const dx = Math.sin(segmentHeading) * segmentDistance
  const dy = Math.cos(segmentHeading) * segmentDistance
  const a = dx * dx + dy * dy
  const b = 2 * (x * dx + y * dy)
  const c = x * x + y * y - radius * radius
  const discriminant = b * b - 4 * a * c
  if (discriminant < 0) return null
  const entry = (-b - Math.sqrt(discriminant)) / (2 * a)
  return entry >= 0 && entry <= 1 ? entry : null
}
