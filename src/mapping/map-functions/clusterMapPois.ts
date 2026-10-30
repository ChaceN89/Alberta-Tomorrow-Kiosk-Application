/**
  File: clusterMapPois.ts | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Group nearby POIs using their projected screen-space positions.

  Usage:
  - Used by AlbertaMap to render individual POIs or cluster markers.

  Notes:
  - Cluster membership is recalculated after map movement ends.
 */
import type { Map as MapLibreMap } from 'maplibre-gl'
import type { MapPoi } from '../components/MapPoiMarker'

type ScreenPoint = {
  x: number
  y: number
}

export type PoiRenderGroup =
  | {
      type: 'poi'
      id: string
      poi: MapPoi
    }
  | {
      type: 'cluster'
      id: string
      pois: readonly MapPoi[]
      coordinates: [number, number]
      expansionZoom: number
    }

function getRoot(parents: number[], index: number): number {
  const parent = parents[index]
  if (parent === undefined) {
    throw new Error('POI cluster index is out of bounds.')
  }
  if (parent === index) return index

  const root = getRoot(parents, parent)
  parents[index] = root
  return root
}

function getMaximumMstEdgeDistance(points: readonly ScreenPoint[]) {
  if (points.length < 2) return 0

  const included = new Set([0])
  let maximumEdgeDistance = 0

  while (included.size < points.length) {
    let nearestIndex = -1
    let nearestDistance = Number.POSITIVE_INFINITY

    for (
      let candidateIndex = 0;
      candidateIndex < points.length;
      candidateIndex += 1
    ) {
      if (included.has(candidateIndex)) continue
      const candidate = points[candidateIndex]
      if (!candidate) {
        throw new Error('POI cluster point is out of bounds.')
      }

      for (const includedIndex of included) {
        const source = points[includedIndex]
        if (!source) {
          throw new Error('POI cluster point is out of bounds.')
        }

        const distance = Math.hypot(
          candidate.x - source.x,
          candidate.y - source.y,
        )
        if (distance < nearestDistance) {
          nearestDistance = distance
          nearestIndex = candidateIndex
        }
      }
    }

    if (nearestIndex < 0) break
    included.add(nearestIndex)
    maximumEdgeDistance = Math.max(maximumEdgeDistance, nearestDistance)
  }

  return maximumEdgeDistance
}

function createSinglePoiGroups(pois: readonly MapPoi[]): PoiRenderGroup[] {
  return pois.map((poi) => ({
    type: 'poi',
    id: `poi:${poi.id}`,
    poi,
  }))
}

export function clusterMapPois(
  pois: readonly MapPoi[],
  map: MapLibreMap | null,
  radius: number,
  currentZoom = map?.getZoom() ?? 0,
): PoiRenderGroup[] {
  if (!map || radius <= 0 || pois.length < 2) {
    return createSinglePoiGroups(pois)
  }

  const points = pois.map((poi) => map.project(poi.coordinates))
  const parents = points.map((_, index) => index)

  for (let firstIndex = 0; firstIndex < points.length; firstIndex += 1) {
    const first = points[firstIndex]
    if (!first) {
      throw new Error('POI cluster point is out of bounds.')
    }

    for (
      let secondIndex = firstIndex + 1;
      secondIndex < points.length;
      secondIndex += 1
    ) {
      const second = points[secondIndex]
      if (!second) {
        throw new Error('POI cluster point is out of bounds.')
      }

      if (Math.hypot(first.x - second.x, first.y - second.y) > radius) {
        continue
      }

      const firstRoot = getRoot(parents, firstIndex)
      const secondRoot = getRoot(parents, secondIndex)
      if (firstRoot !== secondRoot) {
        parents[secondRoot] = firstRoot
      }
    }
  }

  const groups = new Map<number, number[]>()
  for (let index = 0; index < pois.length; index += 1) {
    const root = getRoot(parents, index)
    const group = groups.get(root) ?? []
    group.push(index)
    groups.set(root, group)
  }

  return [...groups.values()].map((indexes) => {
    const members = indexes.map((index) => {
      const poi = pois[index]
      if (!poi) {
        throw new Error('POI cluster member is out of bounds.')
      }
      return poi
    })

    if (members.length === 1) {
      const poi = members[0]
      if (!poi) {
        throw new Error('POI cluster member is out of bounds.')
      }

      return {
        type: 'poi',
        id: `poi:${poi.id}`,
        poi,
      }
    }

    const memberPoints = indexes.map((index) => {
      const point = points[index]
      if (!point) {
        throw new Error('POI cluster point is out of bounds.')
      }
      return point
    })
    const centerX =
      memberPoints.reduce((total, point) => total + point.x, 0) /
      memberPoints.length
    const centerY =
      memberPoints.reduce((total, point) => total + point.y, 0) /
      memberPoints.length

    const expansionDistance = getMaximumMstEdgeDistance(memberPoints)

    return {
      type: 'cluster',
      id: `cluster:${members.map((poi) => poi.id).join(':')}`,
      pois: members,
      coordinates: map.unproject([centerX, centerY]).toArray(),
      expansionZoom: getPoiClusterExpansionZoom(
        expansionDistance,
        radius,
        currentZoom,
        map.getMaxZoom(),
      ),
    }
  })
}

export function getPoiClusterExpansionZoom(
  expansionDistance: number,
  clusterRadius: number,
  currentZoom: number,
  maxZoom: number,
) {
  const scaleFactor = clusterRadius / Math.max(expansionDistance, 1)
  const zoomIncrease = Math.max(0.5, Math.log2(scaleFactor) + 0.25)

  return Math.min(maxZoom, currentZoom + zoomIncrease)
}
