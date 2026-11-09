/**
  File: useBaseMapFlightSpawn.ts | Author: Chace Nielson
  Date Created: Nov 9, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Offer the southern plane spawn until the base-map camera is moved.

  Usage:
  - The map controller consumes the spawn on entry and re-arms it after reset.

  Notes:
  - Terrain-toggle pitch changes are exempt; other camera movement is not.
 */
import { useCallback, useEffect, useRef } from 'react'
import type { Map as MapLibreMap } from 'maplibre-gl'
import { FLYOVER_BASE_MAP_INITIAL_SPAWN } from '../../map-settings/flyoverSettings'

function readCamera(map: MapLibreMap) {
  const center = map.getCenter()
  return {
    longitude: center.lng,
    latitude: center.lat,
    zoom: map.getZoom(),
    bearing: map.getBearing(),
    pitch: map.getPitch(),
  }
}

export function useBaseMapFlightSpawn(
  map: MapLibreMap | null,
  isReady: boolean,
  enabled: boolean,
) {
  const eligible = useRef(true)
  const ignorePitch = useRef(false)
  useEffect(() => {
    if (!map || !isReady || !enabled) return
    let previous = readCamera(map)
    const onMove = () => {
      const current = readCamera(map)
      if (
        Math.abs(current.longitude - previous.longitude) > 1e-8 ||
        Math.abs(current.latitude - previous.latitude) > 1e-8 ||
        Math.abs(current.zoom - previous.zoom) > 1e-8 ||
        Math.abs(current.bearing - previous.bearing) > 1e-8 ||
        (!ignorePitch.current &&
          Math.abs(current.pitch - previous.pitch) > 1e-8)
      )
        eligible.current = false
      previous = current
    }
    const onMoveEnd = () => {
      ignorePitch.current = false
    }
    map.on('move', onMove)
    map.on('moveend', onMoveEnd)
    return () => {
      map.off('move', onMove)
      map.off('moveend', onMoveEnd)
    }
  }, [enabled, isReady, map])

  const takeInitialSpawn = useCallback(() => {
    const spawn =
      enabled && eligible.current ? FLYOVER_BASE_MAP_INITIAL_SPAWN : null
    eligible.current = false
    return spawn
  }, [enabled])
  const resetInitialSpawn = useCallback(() => {
    eligible.current = true
  }, [])
  const runTerrainToggle = (toggle: () => void) => {
    ignorePitch.current = true
    try {
      toggle()
    } finally {
      if (!map?.isMoving()) ignorePitch.current = false
    }
  }
  return { takeInitialSpawn, resetInitialSpawn, runTerrainToggle }
}
