/**
  File: useMapStartup.ts | Author: Chace Nielson
  Date Created: Nov 9, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Wait for a rendered opening scene before revealing the map and its controls.

  Usage:
  - AlbertaMap supplies setup, camera, POI, and aircraft readiness.

  Notes:
  - Latches after the first reveal; later tile streaming does not reopen the gate.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Map as MapLibreMap } from 'maplibre-gl'
import {
  ALBERTA_BOUNDARY_SOURCE_ID,
  ALBERTA_BOUNDARY_WALL_HEIGHT_METERS,
  ALBERTA_BOUNDARY_WALL_LAYER_ID,
} from '../map-settings/mapSettings'
import { TERRAIN_SOURCE_ID } from '../map-settings/terrainSettings'
import {
  MAP_REVEAL_DURATION_MS,
  MAP_STARTUP_SETTLE_MS,
  MAP_STARTUP_TIMEOUT_MS,
  MAP_STARTUP_MOVEMENT_DELAY_MS,
} from '../map-settings/mapLoadingSettings'
import { isAlbertaBoundaryWallReady } from '../map-functions/createAlbertaBoundaryWallLayer'

type MapStartupOptions = {
  onReady: () => void
  map: MapLibreMap | null
  isSetupReady: boolean
  isCameraReady: boolean
  isPoiDataReady: boolean
  needsAircraft: boolean
  isAircraftReady: boolean
  isBoundaryEnabled: boolean
  isWallEnabled: boolean
}

export function useMapStartup(options: MapStartupOptions) {
  const [state, setState] = useState<
    'loading' | 'revealing' | 'waiting' | 'ready' | 'error'
  >('loading')
  const latest = useRef(options)
  useEffect(() => {
    latest.current = options
  })

  const fail = useCallback((cause: unknown) => {
    const failure = cause instanceof Error ? cause : new Error(String(cause))
    console.error('Unable to prepare the opening map scene.', failure)
    setState((current) => (current === 'ready' ? current : 'error'))
  }, [])
  useEffect(() => {
    if (state !== 'loading') return
    const timeout = window.setTimeout(
      () => fail(new Error('Opening map scene timed out.')),
      MAP_STARTUP_TIMEOUT_MS,
    )
    return () => window.clearTimeout(timeout)
  }, [fail, state])

  useEffect(() => {
    const map = options.map
    if (!map || state !== 'loading') return
    let stableSince: number | null = null
    let confirmationFrame = false
    const invalidate = () => {
      stableSince = null
      confirmationFrame = false
    }
    const check = () => {
      const current = latest.current
      const wallNeeded =
        current.isWallEnabled && ALBERTA_BOUNDARY_WALL_HEIGHT_METERS > 0
      const boundaryNeeded = current.isBoundaryEnabled || wallNeeded
      const ready =
        current.isSetupReady &&
        current.isCameraReady &&
        current.isPoiDataReady &&
        (!current.needsAircraft || current.isAircraftReady) &&
        !map.isMoving() &&
        map.isStyleLoaded() &&
        map.areTilesLoaded() &&
        (!map.getTerrain() || map.isSourceLoaded(TERRAIN_SOURCE_ID)) &&
        (!boundaryNeeded ||
          (!!map.getSource(ALBERTA_BOUNDARY_SOURCE_ID) &&
            map.isSourceLoaded(ALBERTA_BOUNDARY_SOURCE_ID))) &&
        (!wallNeeded ||
          (!!map.getLayer(ALBERTA_BOUNDARY_WALL_LAYER_ID) &&
            isAlbertaBoundaryWallReady(map)))
      if (!ready) {
        invalidate()
        return
      }
      stableSince ??= performance.now()
      if (performance.now() - stableSince < MAP_STARTUP_SETTLE_MS) return
      if (!confirmationFrame) {
        confirmationFrame = true
        map.triggerRepaint()
        return
      }
      setState('revealing')
    }
    // Polling requests a confirming render even when the map has become idle.
    const interval = window.setInterval(() => map.triggerRepaint(), 100)
    map.on('render', check)
    map.on('movestart', invalidate)
    map.on('sourcedata', invalidate)
    return () => {
      window.clearInterval(interval)
      map.off('render', check)
      map.off('movestart', invalidate)
      map.off('sourcedata', invalidate)
    }
  }, [options.map, state])

  useEffect(() => {
    if (state !== 'revealing') return
    const timer = window.setTimeout(() => {
      setState('waiting')
    }, MAP_REVEAL_DURATION_MS)
    return () => window.clearTimeout(timer)
  }, [state])

  useEffect(() => {
    if (state !== 'waiting') return
    const timer = window.setTimeout(() => {
      setState('ready')
      latest.current.onReady()
    }, MAP_STARTUP_MOVEMENT_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [state])

  return {
    state,
    fail,
    isVisible: state !== 'loading' && state !== 'error',
    isLoadingScreenVisible:
      state === 'loading' || state === 'revealing' || state === 'error',
  }
}
