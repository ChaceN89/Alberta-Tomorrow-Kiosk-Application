/**
  File: AlbertaMap.tsx | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Oct 30, 2026 - CN - Support 90-degree pitch and POI navigation.

  Description:
  - Render the shared Alberta map and manage map view settings.
  - Register elevation data before allowing terrain controls.

  Usage:
  - Used by default and module-specific explore views.
  - The parent must provide a positioned container with a defined height.

  Notes:
  - OpenFreeMap supplies vector basemaps.
  - Mapterhorn supplies Terrarium-encoded elevation tiles.
  - Esri supplies satellite imagery.
 */
import { useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Map, NavigationControl } from 'react-map-gl/maplibre'
import type { MapRef } from 'react-map-gl/maplibre'
import * as maplibregl from 'maplibre-gl'
import mapWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url'
import { MapControlsContext } from './components/MapControlsContext'
import type { MapControlsProps } from './components/MapControlsContext'
import {
  DEFAULT_BASEMAP_STYLE_ID,
  getBasemapStyle,
  SATELLITE_LAYER_ID,
  SATELLITE_SOURCE,
  SATELLITE_SOURCE_ID,
  type BasemapStyleId,
} from './map-settings/baseMapSettings'
import {
  getDefaultPoi,
  POI_NAVIGATION_DURATION,
  type DefaultPoiId,
} from './map-settings/defaultPOISettings'
import {
  CAMERA_MOVE_DURATION,
  HILLSHADING_DEFAULT,
  ICONS_DEFAULT,
  INITIAL_VIEW,
  SATELLITE_IMAGE_DEFAULT,
  START_IN_3D_DEFAULT,
  ZOOM_MAX,
  ZOOM_MIN,
} from './map-settings/mapSettings'
import {
  DEFAULT_TERRAIN_EXAGGERATION,
  HILLSHADE_LAYER_ID,
  MAX_CAMERA_PITCH,
  DEFAULT_TERRAIN_PITCH,
  TERRAIN_TRANSITION_DURATION,
  TERRAIN_EXAGGERATION_MAX,
  TERRAIN_EXAGGERATION_MIN,
  TERRAIN_SOURCE,
  TERRAIN_SOURCE_ID,
} from './map-settings/terrainSettings'
import 'maplibre-gl/dist/maplibre-gl.css'

maplibregl.setWorkerUrl(mapWorkerUrl)

type AlbertaMapProps = {
  ariaLabel: string
  moduleId?: string
  children?: ReactNode
}

function ensureTerrainSource(map: maplibregl.Map) {
  if (map.getSource(TERRAIN_SOURCE_ID)) return
  map.addSource(TERRAIN_SOURCE_ID, TERRAIN_SOURCE)
}

function getFirstSymbolLayerId(map: maplibregl.Map) {
  return map.getStyle().layers?.find(({ type }) => type === 'symbol')?.id
}

function ensureHillshadeLayer(map: maplibregl.Map) {
  if (!map.getLayer(HILLSHADE_LAYER_ID)) {
    map.addLayer(
      {
        id: HILLSHADE_LAYER_ID,
        type: 'hillshade',
        source: TERRAIN_SOURCE_ID,
        layout: { visibility: 'visible' },
        paint: {
          'hillshade-exaggeration': 0.5,
          'hillshade-shadow-color': '#473b24',
          'hillshade-highlight-color': '#ffffff',
          'hillshade-accent-color': '#000000',
          'hillshade-illumination-direction': 315,
        },
      },
      getFirstSymbolLayerId(map),
    )
  }
}

function ensureSatelliteLayer(map: maplibregl.Map) {
  if (!map.getSource(SATELLITE_SOURCE_ID)) {
    map.addSource(SATELLITE_SOURCE_ID, SATELLITE_SOURCE)
  }

  if (!map.getLayer(SATELLITE_LAYER_ID)) {
    map.addLayer(
      {
        id: SATELLITE_LAYER_ID,
        type: 'raster',
        source: SATELLITE_SOURCE_ID,
        layout: { visibility: 'visible' },
      },
      map.getLayer(HILLSHADE_LAYER_ID)
        ? HILLSHADE_LAYER_ID
        : getFirstSymbolLayerId(map),
    )
  }
}

function setPoiLayerVisibility(map: maplibregl.Map, isVisible: boolean) {
  const poiLayers =
    map
      .getStyle()
      .layers?.filter(
        (layer) =>
          layer.type === 'symbol' &&
          'source-layer' in layer &&
          (layer['source-layer'] === 'poi' || layer['source-layer'] === 'park'),
      ) ?? []

  if (poiLayers.length === 0) {
    throw new Error('The active basemap has no point-of-interest label layers.')
  }

  const visibility = isVisible ? 'visible' : 'none'
  for (const layer of poiLayers) {
    map.setLayoutProperty(layer.id, 'visibility', visibility)
  }
}

function getAnimationDuration(duration: number) {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ? 0
    : duration
}

export function AlbertaMap({ ariaLabel, moduleId, children }: AlbertaMapProps) {
  const mapRef = useRef<MapRef>(null)
  const initialMapView = {
    ...INITIAL_VIEW,
    pitch: START_IN_3D_DEFAULT ? DEFAULT_TERRAIN_PITCH : INITIAL_VIEW.pitch,
  }

  const [isMapReady, setIsMapReady] = useState(false)
  const [isStyleLoading, setIsStyleLoading] = useState(false)
  const [isTerrainEnabled, setIsTerrainEnabled] = useState(START_IN_3D_DEFAULT)
  const [isTerrainTransitioning, setIsTerrainTransitioning] = useState(false)
  const [terrainExaggeration, setTerrainExaggeration] = useState(
    DEFAULT_TERRAIN_EXAGGERATION,
  )
  const [basemapStyleId, setBasemapStyleId] = useState<BasemapStyleId>(
    DEFAULT_BASEMAP_STYLE_ID,
  )
  const [isHillshadeEnabled, setIsHillshadeEnabled] =
    useState(HILLSHADING_DEFAULT)
  const [isSatelliteEnabled, setIsSatelliteEnabled] = useState(
    SATELLITE_IMAGE_DEFAULT,
  )
  const [isPoiLayerEnabled, setIsPoiLayerEnabled] = useState(ICONS_DEFAULT)
  const [cameraPitch, setCameraPitch] = useState(initialMapView.pitch)
  const [cameraZoom, setCameraZoom] = useState(Math.round(INITIAL_VIEW.zoom))
  const [hasMapError, setHasMapError] = useState(false)

  const reportError = (error: unknown) => {
    console.error('Alberta map error:', error)
    setHasMapError(true)
  }

  const initializeMap = (map: maplibregl.Map) => {
    try {
      ensureTerrainSource(map)
      if (SATELLITE_IMAGE_DEFAULT) ensureSatelliteLayer(map)
      if (HILLSHADING_DEFAULT) ensureHillshadeLayer(map)
      setPoiLayerVisibility(map, ICONS_DEFAULT)
      map.setTerrain(
        START_IN_3D_DEFAULT
          ? {
              source: TERRAIN_SOURCE_ID,
              exaggeration: DEFAULT_TERRAIN_EXAGGERATION,
            }
          : null,
      )
      map.setMaxPitch(START_IN_3D_DEFAULT ? MAX_CAMERA_PITCH : 0)
      map.on('moveend', () => {
        setCameraPitch(Math.round(map.getPitch() / 5) * 5)
        setCameraZoom(Math.round(map.getZoom()))
      })
      setIsMapReady(true)
    } catch (error) {
      reportError(error)
    }
  }

  const applyTerrain = (enabled: boolean) => {
    const map = mapRef.current?.getMap()
    if (!map || !isMapReady) return null

    try {
      setHasMapError(false)
      ensureTerrainSource(map)
      map.setTerrain(
        enabled
          ? {
              source: TERRAIN_SOURCE_ID,
              exaggeration: terrainExaggeration,
            }
          : null,
      )
      setIsTerrainEnabled(enabled)
      return map
    } catch (error) {
      reportError(error)
      return null
    }
  }

  const changeTerrainExaggeration = (exaggeration: number) => {
    try {
      if (
        !Number.isInteger(exaggeration) ||
        exaggeration < TERRAIN_EXAGGERATION_MIN ||
        exaggeration > TERRAIN_EXAGGERATION_MAX
      ) {
        throw new Error(
          `Terrain exaggeration must be an integer from ${TERRAIN_EXAGGERATION_MIN} to ${TERRAIN_EXAGGERATION_MAX}.`,
        )
      }

      const map = mapRef.current?.getMap()
      if (isTerrainEnabled) {
        if (!map || !isMapReady) {
          throw new Error('Cannot update terrain before the map is ready.')
        }

        map.setTerrain({
          source: TERRAIN_SOURCE_ID,
          exaggeration,
        })
      }

      setTerrainExaggeration(exaggeration)
      setHasMapError(false)
    } catch (error) {
      reportError(error)
    }
  }

  const changeBasemapStyle = (styleId: string) => {
    const map = mapRef.current?.getMap()
    if (!map || !isMapReady) return

    let restoreMapSettings: (() => void) | null = null
    let style: ReturnType<typeof getBasemapStyle>
    try {
      style = getBasemapStyle(styleId)
      setHasMapError(false)
      setIsStyleLoading(true)

      restoreMapSettings = () => {
        try {
          ensureTerrainSource(map)
          if (isSatelliteEnabled) ensureSatelliteLayer(map)
          if (isHillshadeEnabled) ensureHillshadeLayer(map)
          setPoiLayerVisibility(map, isPoiLayerEnabled)
          map.setTerrain(
            isTerrainEnabled
              ? {
                  source: TERRAIN_SOURCE_ID,
                  exaggeration: terrainExaggeration,
                }
              : null,
          )
          map.setMaxPitch(isTerrainEnabled ? MAX_CAMERA_PITCH : 0)
          setHasMapError(false)
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
      setHasMapError(false)
    } catch (error) {
      reportError(error)
    }
  }

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
      setHasMapError(false)
    } catch (error) {
      reportError(error)
    }
  }

  const changePoiLayerVisibility = (enabled: boolean) => {
    const map = mapRef.current?.getMap()
    if (!map || !isMapReady) return

    try {
      setPoiLayerVisibility(map, enabled)
      setIsPoiLayerEnabled(enabled)
      setHasMapError(false)
    } catch (error) {
      reportError(error)
    }
  }

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

  const toggleTerrain = () => {
    if (isTerrainTransitioning || isStyleLoading) return

    const map = mapRef.current?.getMap()
    if (!map || !isMapReady) return

    const enabled = !isTerrainEnabled

    if (enabled) {
      const terrainMap = applyTerrain(true)
      if (!terrainMap) return

      let transitionFinished = false
      const finishTransition = () => {
        if (transitionFinished) return
        transitionFinished = true
        terrainMap.off('moveend', finishTransition)
        setIsTerrainTransitioning(false)
      }
      try {
        terrainMap.setMaxPitch(MAX_CAMERA_PITCH)
        terrainMap.stop()
        setIsTerrainTransitioning(true)
        terrainMap.once('moveend', finishTransition)
        terrainMap.easeTo({
          pitch: DEFAULT_TERRAIN_PITCH,
          duration: getAnimationDuration(TERRAIN_TRANSITION_DURATION),
        })
        if (!terrainMap.isMoving()) finishTransition()
      } catch (error) {
        terrainMap.off('moveend', finishTransition)
        setIsTerrainTransitioning(false)
        reportError(error)
      }

      return
    }

    setIsTerrainTransitioning(true)
    let transitionFinished = false
    const finishTransition = () => {
      if (transitionFinished) return
      transitionFinished = true
      map.off('moveend', finishTransition)

      try {
        if (map.getPitch() <= 0.5) {
          map.setTerrain(null)
          map.setMaxPitch(0)
          setIsTerrainEnabled(false)
          setHasMapError(false)
        }
      } catch (error) {
        reportError(error)
      } finally {
        setIsTerrainTransitioning(false)
      }
    }

    try {
      map.stop()
      map.once('moveend', finishTransition)
      map.easeTo({
        pitch: 0,
        duration: getAnimationDuration(TERRAIN_TRANSITION_DURATION),
      })
      if (!map.isMoving()) finishTransition()
    } catch (error) {
      map.off('moveend', finishTransition)
      setIsTerrainTransitioning(false)
      reportError(error)
    }
  }

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
    } catch (error) {
      reportError(error)
    }
  }

  const controls: MapControlsProps = {
    hasMapError,
    isMapReady,
    isStyleLoading,
    isTerrainEnabled,
    isTerrainTransitioning,
    terrainExaggeration,
    basemapStyleId,
    isHillshadeEnabled,
    isSatelliteEnabled,
    isPoiLayerEnabled,
    cameraPitch,
    cameraZoom,
    onTerrainExaggerationChange: changeTerrainExaggeration,
    onBasemapStyleChange: changeBasemapStyle,
    onHillshadeChange: changeHillshade,
    onSatelliteChange: changeSatellite,
    onPoiLayerChange: changePoiLayerVisibility,
    onCameraPitchChange: changeCameraPitch,
    onCameraZoomChange: changeCameraZoom,
    onToggleTerrain: toggleTerrain,
    onNavigateToPoi: navigateToPoi,
  }

  return (
    <MapControlsContext.Provider value={controls}>
      <div
        role="region"
        aria-label={ariaLabel}
        data-module-id={moduleId}
        className="absolute inset-0"
      >
        <Map
          ref={mapRef}
          mapLib={maplibregl}
          initialViewState={initialMapView}
          mapStyle={getBasemapStyle(basemapStyleId).url}
          minZoom={ZOOM_MIN}
          maxZoom={ZOOM_MAX}
          style={{ width: '100%', height: '100%' }}
          onLoad={(event) => initializeMap(event.target)}
          onError={(event) => {
            reportError(event.error)
            setIsStyleLoading(false)
          }}
        >
          <NavigationControl
            position="bottom-right"
            showCompass
            visualizePitch
          />
        </Map>

        {children}
      </div>
    </MapControlsContext.Provider>
  )
}
