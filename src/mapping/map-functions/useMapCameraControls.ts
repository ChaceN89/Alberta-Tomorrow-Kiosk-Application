/**
  File: useMapCameraControls.ts | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Nov 7, 2026

  Description:
  - Manage terrain-aware camera navigation to points of interest.

  Usage:
  - Used by useAlbertaMapController.

  Notes:
  - Terrain setup is delegated to useTerrainControls.
 */
import type { Map as MapLibreMap } from 'maplibre-gl'
import { getBasePoi, type BasePoiId } from '@/mapping/POIs/BasePOIList'
import { POI_NAVIGATION_DURATION } from '../map-settings/mapSettings'
import { MAX_CAMERA_PITCH } from '../map-settings/terrainSettings'
import { getAnimationDuration } from './mapAnimationFunctions'

type UseMapCameraControlsOptions = {
  isStyleLoading: boolean
  isTerrainTransitioning: boolean
  applyTerrain: (enabled: boolean) => MapLibreMap | null
  reportError: (error: unknown) => void
  clearError: () => void
}

// Function: Manage the map camera and navigation state and callbacks.
export function useMapCameraControls({
  isStyleLoading,
  isTerrainTransitioning,
  applyTerrain,
  reportError,
  clearError,
}: UseMapCameraControlsOptions) {
  // Function: Fly to a configured POI and enable terrain for its view.
  const navigateToPoi = (poiId: BasePoiId, offset?: [number, number]) => {
    if (isTerrainTransitioning || isStyleLoading) return

    let poi: ReturnType<typeof getBasePoi>
    try {
      poi = getBasePoi(poiId)
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
        offset,
        duration: getAnimationDuration(POI_NAVIGATION_DURATION),
      })
      clearError()
    } catch (error) {
      reportError(error)
    }
  }

  return {
    navigateToPoi,
  }
}
