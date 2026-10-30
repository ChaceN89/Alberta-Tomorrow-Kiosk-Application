/**
  File: useMapLayerControls.ts | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Manage basemap selection and visibility of optional map layers.

  Usage:
  - Used by useAlbertaMapController.

  Notes:
  - Custom layer creation and visibility helpers live in mapLayerFunctions.
 */
import { useState } from 'react'
import type { Dispatch, RefObject, SetStateAction } from 'react'
import type { MapRef } from 'react-map-gl/maplibre'
import type { Map as MapLibreMap } from 'maplibre-gl'
import {
  DEFAULT_BASEMAP_STYLE_ID,
  getBasemapStyle,
  SATELLITE_LAYER_ID,
  SATELLITE_SOURCE_ID,
  type BasemapStyleId,
} from '../map-settings/baseMapSettings'
import {
  ALBERTA_BOUNDARY_DEFAULT,
  BASEMAP_PLACES_DEFAULT,
  HILLSHADING_DEFAULT,
  SATELLITE_IMAGE_DEFAULT,
} from '../map-settings/mapSettings'
import {
  HILLSHADE_LAYER_ID,
  MAX_CAMERA_PITCH,
  TERRAIN_SOURCE_ID,
} from '../map-settings/terrainSettings'
import {
  ensureHillshadeLayer,
  ensureSatelliteLayer,
  ensureTerrainSource,
  setAlbertaBoundaryVisibility,
  setBasemapPlacesVisibility,
} from './mapLayerFunctions'

type UseMapLayerControlsOptions = {
  mapRef: RefObject<MapRef | null>
  isMapReady: boolean
  isTerrainEnabled: boolean
  terrainExaggeration: number
  setIsStyleLoading: Dispatch<SetStateAction<boolean>>
  reportError: (error: unknown) => void
  clearError: () => void
}

// Function: Manage the basemap and optional map-layer settings.
export function useMapLayerControls({
  mapRef,
  isMapReady,
  isTerrainEnabled,
  terrainExaggeration,
  setIsStyleLoading,
  reportError,
  clearError,
}: UseMapLayerControlsOptions) {
  const [basemapStyleId, setBasemapStyleId] = useState<BasemapStyleId>(
    DEFAULT_BASEMAP_STYLE_ID,
  )
  const [isHillshadeEnabled, setIsHillshadeEnabled] =
    useState(HILLSHADING_DEFAULT)
  const [isSatelliteEnabled, setIsSatelliteEnabled] = useState(
    SATELLITE_IMAGE_DEFAULT,
  )
  const [isBasemapPlacesEnabled, setIsBasemapPlacesEnabled] = useState(
    BASEMAP_PLACES_DEFAULT,
  )
  const [isAlbertaBoundaryEnabled, setIsAlbertaBoundaryEnabled] = useState(
    ALBERTA_BOUNDARY_DEFAULT,
  )

  // Function: Add startup layers and apply their configured default visibility.
  const initializeMapLayers = (map: MapLibreMap) => {
    ensureTerrainSource(map)
    if (SATELLITE_IMAGE_DEFAULT) ensureSatelliteLayer(map)
    if (HILLSHADING_DEFAULT) ensureHillshadeLayer(map)
    setBasemapPlacesVisibility(map, BASEMAP_PLACES_DEFAULT)
    if (ALBERTA_BOUNDARY_DEFAULT) {
      setAlbertaBoundaryVisibility(map, ALBERTA_BOUNDARY_DEFAULT)
    }
  }

  // Function: Reapply custom layers and terrain after a basemap style is loaded.
  const restoreMapLayers = (map: MapLibreMap) => {
    ensureTerrainSource(map)
    if (isSatelliteEnabled) ensureSatelliteLayer(map)
    if (isHillshadeEnabled) ensureHillshadeLayer(map)
    setBasemapPlacesVisibility(map, isBasemapPlacesEnabled)
    if (isAlbertaBoundaryEnabled) {
      setAlbertaBoundaryVisibility(map, isAlbertaBoundaryEnabled)
    }
    map.setTerrain(
      isTerrainEnabled
        ? {
            source: TERRAIN_SOURCE_ID,
            exaggeration: terrainExaggeration,
          }
        : null,
    )
    map.setMaxPitch(isTerrainEnabled ? MAX_CAMERA_PITCH : 0)
  }

  // Function: Change basemap and restore the active layers when its style loads.
  const changeBasemapStyle = (styleId: string) => {
    const map = mapRef.current?.getMap()
    if (!map || !isMapReady) return

    let restoreMapSettings: (() => void) | null = null
    try {
      const style = getBasemapStyle(styleId)
      clearError()
      setIsStyleLoading(true)

      // Function: Restore custom layers and terrain after the new style loads.
      restoreMapSettings = () => {
        try {
          restoreMapLayers(map)
          clearError()
        } catch (error) {
          reportError(error)
        } finally {
          setIsStyleLoading(false)
        }
      }

      map.once('style.load', restoreMapSettings)
      setBasemapStyleId(style.id)
    } catch (error) {
      if (restoreMapSettings) {
        map.off('style.load', restoreMapSettings)
      }
      setIsStyleLoading(false)
      reportError(error)
    }
  }

  // Function: Add or remove hillshading and update its checkbox state.
  const changeHillshade = (enabled: boolean) => {
    const map = mapRef.current?.getMap()
    if (!map || !isMapReady) return

    try {
      ensureTerrainSource(map)
      if (enabled) {
        ensureHillshadeLayer(map)
      } else if (map.getLayer(HILLSHADE_LAYER_ID)) {
        map.removeLayer(HILLSHADE_LAYER_ID)
      }
      setIsHillshadeEnabled(enabled)
      clearError()
    } catch (error) {
      reportError(error)
    }
  }

  // Function: Add or remove satellite imagery and update its checkbox state.
  const changeSatellite = (enabled: boolean) => {
    const map = mapRef.current?.getMap()
    if (!map || !isMapReady) return

    try {
      if (enabled) {
        ensureSatelliteLayer(map)
      } else if (map.getLayer(SATELLITE_LAYER_ID)) {
        map.removeLayer(SATELLITE_LAYER_ID)
        if (map.getSource(SATELLITE_SOURCE_ID)) {
          map.removeSource(SATELLITE_SOURCE_ID)
        }
      }
      setIsSatelliteEnabled(enabled)
      clearError()
    } catch (error) {
      reportError(error)
    }
  }

  // Function: Show or hide built-in basemap place icons and labels.
  const changeBasemapPlacesVisibility = (enabled: boolean) => {
    const map = mapRef.current?.getMap()
    if (!map || !isMapReady) return

    try {
      setBasemapPlacesVisibility(map, enabled)
      setIsBasemapPlacesEnabled(enabled)
      clearError()
    } catch (error) {
      reportError(error)
    }
  }

  // Function: Show or hide the Alberta provincial boundary layer.
  const changeAlbertaBoundaryVisibility = (enabled: boolean) => {
    const map = mapRef.current?.getMap()
    if (!map || !isMapReady) return

    try {
      setAlbertaBoundaryVisibility(map, enabled)
      setIsAlbertaBoundaryEnabled(enabled)
      clearError()
    } catch (error) {
      reportError(error)
    }
  }

  return {
    basemapStyleId,
    isHillshadeEnabled,
    isSatelliteEnabled,
    isBasemapPlacesEnabled,
    isAlbertaBoundaryEnabled,
    initializeMapLayers,
    changeBasemapStyle,
    changeHillshade,
    changeSatellite,
    changeBasemapPlacesVisibility,
    changeAlbertaBoundaryVisibility,
  }
}
