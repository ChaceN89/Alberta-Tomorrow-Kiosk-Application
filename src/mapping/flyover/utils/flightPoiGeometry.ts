/**
  File: flightPoiGeometry.ts | Author: Chace Nielson
  Date Created: Nov 9, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Share POI radius, height, color, fading, and swept flight entry calculations.

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
  FLYOVER_POI_HEIGHT_PADDING_METERS,
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
  poi: Pick<MapPoi, 'isModulePoi' | 'isModuleEntry' | 'isComplete'>,
  isActive = false,
) {
  if (isActive) return FLYOVER_POI_COLORS.active
  if (poi.isModuleEntry) return FLYOVER_POI_COLORS.module
  return poi.isModulePoi
    ? poi.isComplete
      ? FLYOVER_POI_COLORS.complete
      : FLYOVER_POI_COLORS.module
    : poi.isComplete
      ? FLYOVER_POI_COLORS.base
      : FLYOVER_POI_COLORS.baseUnvisited
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
    entry: cylinder + FLYOVER_POI_HEIGHT_PADDING_METERS,
    marker: cylinder + FLYOVER_POI_HEIGHT_ABOVE_CYLINDER_METERS,
  }
}

export function isInsidePoiCylinder(
  position: [number, number, number],
  center: [number, number],
  radius: number,
  height: number,
) {
  return (
    position[2] >= 0 &&
    position[2] <= height &&
    getDistanceMeters(center, [position[0], position[1]]) <= radius
  )
}

export function getCylinderEntry(
  from: [number, number, number],
  to: [number, number, number],
  center: [number, number],
  radius: number,
  height: number,
): number | null {
  const fromCoordinates: [number, number] = [from[0], from[1]]
  const toCoordinates: [number, number] = [to[0], to[1]]
  const distance = getDistanceMeters(center, fromCoordinates)
  const heading = degreesToRadians(getBearingDegrees(center, fromCoordinates))
  const x = Math.sin(heading) * distance
  const y = Math.cos(heading) * distance
  const segmentDistance = getDistanceMeters(fromCoordinates, toCoordinates)
  const segmentHeading = degreesToRadians(
    getBearingDegrees(fromCoordinates, toCoordinates),
  )
  const dx = Math.sin(segmentHeading) * segmentDistance
  const dy = Math.cos(segmentHeading) * segmentDistance
  const a = dx * dx + dy * dy
  const b = 2 * (x * dx + y * dy)
  const c = x * x + y * y - radius * radius
  let entry = 0
  let exit = 1
  if (a === 0) {
    if (c > 0) return null
  } else {
    const discriminant = b * b - 4 * a * c
    if (discriminant < 0) return null
    const root = Math.sqrt(discriminant)
    entry = Math.max(entry, (-b - root) / (2 * a))
    exit = Math.min(exit, (-b + root) / (2 * a))
  }
  const dz = to[2] - from[2]
  if (dz === 0) {
    if (from[2] < 0 || from[2] > height) return null
  } else {
    const bottom = -from[2] / dz
    const top = (height - from[2]) / dz
    entry = Math.max(entry, Math.min(bottom, top))
    exit = Math.min(exit, Math.max(bottom, top))
  }
  return entry <= exit ? entry : null
}
