/**
  File: flightPoiNavigation.ts | Author: Chace Nielson
  Date Created: Nov 9, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Select the next flight destination after leaving a visited POI.

  Usage:
  - Called by AlbertaMap when an automatically opened flight visit closes.

  Notes:
  - Expedition visits prioritize incomplete expedition POIs in list order.
 */
import type { MapPoi } from '../../components/MapPoiMarker'

export function getNextFlightPoi(
  pois: readonly MapPoi[],
  visitedPoiId: string,
): MapPoi | undefined {
  const visited = pois.find((poi) => poi.id === visitedPoiId)
  if (!visited) return undefined
  const candidates = visited.isModuleEntry
    ? pois.filter((poi) => poi.isModuleEntry)
    : visited.isModulePoi
      ? pois.filter((poi) => poi.isModulePoi)
      : pois.filter((poi) => !poi.isModuleEntry)
  const index = candidates.findIndex((poi) => poi.id === visitedPoiId)
  const next = Array.from(
    { length: candidates.length },
    (_, offset) => candidates[(index + offset + 1) % candidates.length],
  )
  return (
    (visited.isModulePoi ? next.find((poi) => !poi.isComplete) : undefined) ??
    next[0]
  )
}
