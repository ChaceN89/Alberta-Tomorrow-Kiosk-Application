/**
  File: useMapCameraControls.ts | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Manage camera position, zoom, pitch, and POI navigation.

  Usage:
  - Used by useAlbertaMapController.

  Notes:
  - Terrain setup is delegated to useTerrainControls.
 */
import { useState } from 'react'
import type { RefObject } from 'react'
import type { MapRef } from 'react-map-gl/maplibre'
import type { Map as MapLibreMap } from 'maplibre-gl'
import {
  getDefaultPoi,
  POI_NAVIGATION_DURATION,
  type DefaultPoiId,
} from '../map-settings/defaultPOISettings'
import { CAMERA_MOVE_DURATION } from '../map-settings/mapSettings'
import { MAX_CAMERA_PITCH } from '../map-settings/terrainSettings'
import { getAnimationDuration } from './mapAnimationFunctions'

type UseMapCameraControlsOptions = {
  mapRef: RefObject<MapRef | null>
  initialPitch: number
  initialZoom: number
  isMapReady: boolean
  isStyleLoading: boolean
  isTerrainEnabled: boolean
  isTerrainTransitioning: boolean
  applyTerrain: (enabled: boolean) => MapLibreMap | null
  reportError: (error: unknown) => void
  clearError: () => void
}

// Function: Manage the map camera and navigation state and callbacks.
export function useMapCameraControls({
  mapRef,
  initialPitch,
  initialZoom,
  isMapReady,
  isStyleLoading,
  isTerrainEnabled,
  isTerrainTransitioning,
  applyTerrain,
  reportError,
  clearError,
}: UseMapCameraControlsOptions) {
  const [cameraPitch, setCameraPitch] = useState(initialPitch)
  const [cameraZoom, setCameraZoom] = useState(initialZoom)

  // Function: Sync pitch and zoom controls after map movement finishes.
  const handleMapMoveEnd = (map: MapLibreMap) => {
    setCameraPitch(Math.round(map.getPitch() / 5) * 5)
    setCameraZoom(Math.round(map.getZoom()))
  }

  // Function: Change camera pitch when terrain is active.
  const changeCameraPitch = (pitch: number) => {
    const map = mapRef.current?.getMap()
    if (!map || !isMapReady || !isTerrainEnabled) return

    try {
      map.easeTo({
        pitch,
        duration: getAnimationDuration(CAMERA_MOVE_DURATION),
      })
      setCameraPitch(pitch)
    } catch (error) {
      reportError(error)
    }
  }

  // Function: Change camera zoom and synchronize the displayed value.
  const changeCameraZoom = (zoom: number) => {
    const map = mapRef.current?.getMap()
    if (!map || !isMapReady) return

    try {
      map.easeTo({ zoom, duration: getAnimationDuration(CAMERA_MOVE_DURATION) })
      setCameraZoom(zoom)
    } catch (error) {
      reportError(error)
    }
  }

  // Function: Fly to a configured POI and enable terrain for its view.
  const navigateToPoi = (poiId: DefaultPoiId) => {
    if (isTerrainTransitioning || isStyleLoading) return

    let poi: ReturnType<typeof getDefaultPoi>
    try {
      poi = getDefaultPoi(poiId)
    } catch (error) {
      reportError(error)
      return
    }

    const map = applyTerrain(true)
    if (!map) return

    try {
      map.setMaxPitch(MAX_CAMERA_PITCH)
      map.flyTo({
        ...poi.view,
        duration: getAnimationDuration(POI_NAVIGATION_DURATION),
      })
      clearError()
    } catch (error) {
      reportError(error)
    }
  }

  return {
    cameraPitch,
    cameraZoom,
    handleMapMoveEnd,
    changeCameraPitch,
    changeCameraZoom,
    navigateToPoi,
  }
}
