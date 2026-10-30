/**
  File: useAlbertaMapController.ts | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Connect map state, layer controls, terrain controls, and camera controls.

  Usage:
  - Used by AlbertaMap to connect map events and map controls.

  Notes:
  - Individual controls are managed by focused hooks in map-functions.
 */
import { useRef, useState } from 'react'
import type { MapRef } from 'react-map-gl/maplibre'
import type { Map as MapLibreMap } from 'maplibre-gl'
import type { MapControllerControlsProps } from '../components/MapControlsContext'
import { getBasemapStyle } from '../map-settings/baseMapSettings'
import {
  INITIAL_VIEW,
  START_IN_3D_DEFAULT,
  ZOOM_MAX,
  ZOOM_MIN,
} from '../map-settings/mapSettings'
import { DEFAULT_TERRAIN_PITCH } from '../map-settings/terrainSettings'
import { useMapCameraControls } from './useMapCameraControls'
import { useMapLayerControls } from './useMapLayerControls'
import { useTerrainControls } from './useTerrainControls'

// Function: Coordinate map state and control hooks for the Alberta map.
export function useAlbertaMapController() {
  const mapRef = useRef<MapRef>(null)
  const [mapInstance, setMapInstance] = useState<MapLibreMap | null>(null)
  const [isMapReady, setIsMapReady] = useState(false)
  const [isStyleLoading, setIsStyleLoading] = useState(false)
  const [hasMapError, setHasMapError] = useState(false)

  // Function: Log map failures and expose them to the map settings UI.
  const reportError = (error: unknown) => {
    console.error('Alberta map error:', error)
    setHasMapError(true)
  }

  // Function: Clear the map error state after an operation succeeds.
  const clearError = () => setHasMapError(false)

  const terrainControls = useTerrainControls({
    mapRef,
    isMapReady,
    isStyleLoading,
    reportError,
    clearError,
  })

  const layerControls = useMapLayerControls({
    mapRef,
    isMapReady,
    isTerrainEnabled: terrainControls.isTerrainEnabled,
    terrainExaggeration: terrainControls.terrainExaggeration,
    setIsStyleLoading,
    reportError,
    clearError,
  })

  const initialMapView = {
    ...INITIAL_VIEW,
    pitch: START_IN_3D_DEFAULT ? DEFAULT_TERRAIN_PITCH : INITIAL_VIEW.pitch,
  }

  const cameraControls = useMapCameraControls({
    mapRef,
    initialPitch: initialMapView.pitch,
    initialZoom: Math.round(INITIAL_VIEW.zoom),
    isMapReady,
    isStyleLoading,
    isTerrainEnabled: terrainControls.isTerrainEnabled,
    isTerrainTransitioning: terrainControls.isTerrainTransitioning,
    applyTerrain: terrainControls.applyTerrain,
    reportError,
    clearError,
  })

  // Function: Apply startup layers and map defaults when MapLibre finishes loading.
  const initializeMap = (map: MapLibreMap) => {
    try {
      layerControls.initializeMapLayers(map)
      terrainControls.initializeTerrain(map)
      setMapInstance(map)

      // Function: Keep camera controls synchronized with map movement.
      const handleMapMoveEnd = () => cameraControls.handleMapMoveEnd(map)
      map.on('moveend', handleMapMoveEnd)

      setIsMapReady(true)
    } catch (error) {
      reportError(error)
    }
  }

  // Function: Report MapLibre errors and end any pending style loading state.
  const handleMapError = (error: unknown) => {
    reportError(error)
    setIsStyleLoading(false)
  }

  const controls: MapControllerControlsProps = {
    hasMapError,
    isMapReady,
    isStyleLoading,
    isTerrainEnabled: terrainControls.isTerrainEnabled,
    isTerrainTransitioning: terrainControls.isTerrainTransitioning,
    terrainExaggeration: terrainControls.terrainExaggeration,
    basemapStyleId: layerControls.basemapStyleId,
    isHillshadeEnabled: layerControls.isHillshadeEnabled,
    isSatelliteEnabled: layerControls.isSatelliteEnabled,
    isBasemapPlacesEnabled: layerControls.isBasemapPlacesEnabled,
    isAlbertaBoundaryEnabled: layerControls.isAlbertaBoundaryEnabled,
    cameraPitch: cameraControls.cameraPitch,
    cameraZoom: cameraControls.cameraZoom,
    onTerrainExaggerationChange: terrainControls.changeTerrainExaggeration,
    onBasemapStyleChange: layerControls.changeBasemapStyle,
    onHillshadeChange: layerControls.changeHillshade,
    onSatelliteChange: layerControls.changeSatellite,
    onBasemapPlacesChange: layerControls.changeBasemapPlacesVisibility,
    onAlbertaBoundaryChange: layerControls.changeAlbertaBoundaryVisibility,
    onCameraPitchChange: cameraControls.changeCameraPitch,
    onCameraZoomChange: cameraControls.changeCameraZoom,
    onToggleTerrain: terrainControls.toggleTerrain,
    onNavigateToPoi: cameraControls.navigateToPoi,
  }

  return {
    controls,
    mapRef,
    mapInstance,
    initialMapView,
    mapStyle: getBasemapStyle(layerControls.basemapStyleId).url,
    minZoom: ZOOM_MIN,
    maxZoom: ZOOM_MAX,
    onMapLoad: initializeMap,
    onMapError: handleMapError,
  }
}
