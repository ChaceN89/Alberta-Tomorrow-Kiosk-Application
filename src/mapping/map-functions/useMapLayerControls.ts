/**
  File: useMapLayerControls.ts | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Manage basemap selection and visibility of optional map layers.

  Usage:
  - Used by useAlbertaMapController.

  Notes:
  - Custom layer creation and visibility helpers live in mapLayerFunctions.
 */
import { useEffect, useRef, useState } from 'react'
import type { Dispatch, RefObject, SetStateAction } from 'react'
import type { MapRef } from 'react-map-gl/maplibre'
import type { ErrorEvent, Map as MapLibreMap } from 'maplibre-gl'
import {
  DEFAULT_BASEMAP_STYLE_ID,
  getBasemapStyle,
  SATELLITE_BASEMAP_STYLE_ID,
  type BasemapStyleId,
} from '../map-settings/baseMapSettings'
import {
  ALBERTA_BOUNDARY_DEFAULT,
  ALBERTA_BOUNDARY_WALL_DEFAULT,
  HILLSHADING_DEFAULT,
} from '../map-settings/mapSettings'
import {
  HILLSHADE_LAYER_ID,
  MAX_CAMERA_PITCH,
  TERRAIN_SOURCE_ID,
} from '../map-settings/terrainSettings'
import {
  ensureHillshadeLayer,
  ensureTerrainSource,
  setAlbertaBoundaryVisibility,
  setAlbertaBoundaryWallVisibility,
  setBasemapPlacesVisibility,
} from './mapLayerFunctions'

type UseMapLayerControlsOptions = {
  mapRef: RefObject<MapRef | null>
  isMapReady: boolean
  startSatellite: boolean
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
  startSatellite,
  isTerrainEnabled,
  terrainExaggeration,
  setIsStyleLoading,
  reportError,
  clearError,
}: UseMapLayerControlsOptions) {
  const [basemapStyleId, setBasemapStyleId] = useState<BasemapStyleId>(
    startSatellite ? SATELLITE_BASEMAP_STYLE_ID : DEFAULT_BASEMAP_STYLE_ID,
  )
  const [isHillshadeEnabled, setIsHillshadeEnabled] =
    useState(HILLSHADING_DEFAULT)
  const [isAlbertaBoundaryEnabled, setIsAlbertaBoundaryEnabled] = useState(
    ALBERTA_BOUNDARY_DEFAULT,
  )
  const cancelStyleChange = useRef<(() => void) | null>(null)
  const [isAlbertaBoundaryWallEnabled, setIsAlbertaBoundaryWallEnabled] =
    useState(ALBERTA_BOUNDARY_WALL_DEFAULT)

  useEffect(() => () => cancelStyleChange.current?.(), [])

  // Function: Add startup layers and apply their configured default visibility.
  const initializeMapLayers = (map: MapLibreMap, styleId: BasemapStyleId) => {
    ensureTerrainSource(map)
    if (HILLSHADING_DEFAULT) ensureHillshadeLayer(map)
    else if (map.getLayer(HILLSHADE_LAYER_ID))
      map.removeLayer(HILLSHADE_LAYER_ID)
    if (styleId !== SATELLITE_BASEMAP_STYLE_ID) {
      setBasemapPlacesVisibility(map, false)
    }
    setAlbertaBoundaryVisibility(map, ALBERTA_BOUNDARY_DEFAULT)
    setAlbertaBoundaryWallVisibility(map, ALBERTA_BOUNDARY_WALL_DEFAULT)
  }

  // Function: Reapply custom layers and terrain after a basemap style is loaded.
  const restoreMapLayers = (
    map: MapLibreMap,
    styleId: BasemapStyleId,
    resetDefaults: boolean,
  ) => {
    if (resetDefaults) {
      initializeMapLayers(map, styleId)
    } else {
      ensureTerrainSource(map)
      if (isHillshadeEnabled) ensureHillshadeLayer(map)
      if (styleId !== SATELLITE_BASEMAP_STYLE_ID) {
        setBasemapPlacesVisibility(map, false)
      }
      if (isAlbertaBoundaryEnabled) {
        setAlbertaBoundaryVisibility(map, isAlbertaBoundaryEnabled)
      }
      setAlbertaBoundaryWallVisibility(map, isAlbertaBoundaryWallEnabled)
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
  const changeBasemapStyle = async (styleId: string, resetDefaults = false) => {
    const map = mapRef.current?.getMap()
    if (!map || !isMapReady) {
      reportError(new Error('Cannot change basemap before the map is ready.'))
      return false
    }

    try {
      const style = getBasemapStyle(styleId)
      cancelStyleChange.current?.()
      clearError()
      if (resetDefaults) {
        setIsHillshadeEnabled(HILLSHADING_DEFAULT)
        setIsAlbertaBoundaryEnabled(ALBERTA_BOUNDARY_DEFAULT)
        setIsAlbertaBoundaryWallEnabled(ALBERTA_BOUNDARY_WALL_DEFAULT)
      }
      if (style.id === basemapStyleId) {
        restoreMapLayers(map, style.id, resetDefaults)
        return true
      }

      return await new Promise<boolean>((resolve) => {
        const cleanup = () => {
          map.off('style.load', restoreMapSettings)
          map.off('error', failStyleChange)
          cancelStyleChange.current = null
        }
        const restoreMapSettings = () => {
          cleanup()
          try {
            restoreMapLayers(map, style.id, resetDefaults)
            clearError()
            resolve(true)
          } catch (error) {
            reportError(error)
            resolve(false)
          } finally {
            setIsStyleLoading(false)
          }
        }
        const failStyleChange = (event: ErrorEvent) => {
          cleanup()
          reportError(event.error)
          setIsStyleLoading(false)
          resolve(false)
        }
        cancelStyleChange.current = () => {
          cleanup()
          resolve(false)
        }
        setIsStyleLoading(true)
        map.once('style.load', restoreMapSettings)
        map.once('error', failStyleChange)
        setBasemapStyleId(style.id)
      })
    } catch (error) {
      cancelStyleChange.current?.()
      setIsStyleLoading(false)
      reportError(error)
      return false
    }
  }

  const resetMapLayers = () =>
    changeBasemapStyle(
      startSatellite ? SATELLITE_BASEMAP_STYLE_ID : DEFAULT_BASEMAP_STYLE_ID,
      true,
    )

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

  const changeAlbertaBoundaryWallVisibility = (enabled: boolean) => {
    const map = mapRef.current?.getMap()
    if (!map || !isMapReady) return

    try {
      setAlbertaBoundaryWallVisibility(map, enabled)
      setIsAlbertaBoundaryWallEnabled(enabled)
      clearError()
    } catch (error) {
      reportError(error)
    }
  }

  return {
    basemapStyleId,
    isHillshadeEnabled,
    isAlbertaBoundaryEnabled,
    isAlbertaBoundaryWallEnabled,
    initializeMapLayers,
    changeBasemapStyle,
    changeHillshade,
    changeAlbertaBoundaryVisibility,
    changeAlbertaBoundaryWallVisibility,
    resetMapLayers,
  }
}
