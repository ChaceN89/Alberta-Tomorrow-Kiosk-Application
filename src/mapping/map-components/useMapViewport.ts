/**
  File: useMapViewport.ts | Author: Chace Nielson
  Date Created: Nov 8, 2026
  Date Updated: Nov 8, 2026

  Description:
  - Track the current map center and zoom for POI clustering and telemetry.

  Usage:
  - Used by AlbertaMap with the active MapLibre instance.

  Notes:
  - While flying, updates are throttled to limit repeated cluster calculations.
 */
import { useCallback, useEffect, useState } from 'react'
import type { Map as MapLibreMap } from 'maplibre-gl'
import { FLYOVER_MARKER_UPDATE_INTERVAL } from '../map-settings/flyoverSettings'

export type MapViewport = {
  zoom: number
  center: [number, number]
}

export function useMapViewport(
  mapInstance: MapLibreMap | null,
  isFlyoverEnabled: boolean,
) {
  const [mapViewport, setMapViewport] = useState<MapViewport | null>(null)
  const updateMapViewport = useCallback((map: MapLibreMap) => {
    const { lng, lat } = map.getCenter()
    setMapViewport({ zoom: map.getZoom(), center: [lng, lat] })
  }, [])

  useEffect(() => {
    if (!mapInstance) return

    let lastUpdate = 0
    let hasSkippedUpdate = false
    const handleMove = () => {
      if (isFlyoverEnabled) {
        const now = performance.now()
        if (now - lastUpdate < FLYOVER_MARKER_UPDATE_INTERVAL) {
          hasSkippedUpdate = true
          return
        }
        lastUpdate = now
      }

      hasSkippedUpdate = false
      updateMapViewport(mapInstance)
    }

    mapInstance.on('move', handleMove)
    return () => {
      mapInstance.off('move', handleMove)
      if (hasSkippedUpdate) updateMapViewport(mapInstance)
    }
  }, [isFlyoverEnabled, mapInstance, updateMapViewport])

  return { mapViewport, updateMapViewport }
}
