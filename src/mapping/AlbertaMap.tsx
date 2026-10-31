/**
  File: AlbertaMap.tsx | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Render the shared Alberta map and its map controls.

  Usage:
  - Used by default and module-specific explore views.
  - The parent must provide a positioned container with a defined height.

  Notes:
  - Map state and behavior are managed by useAlbertaMapController.
 */
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Map, NavigationControl } from 'react-map-gl/maplibre'
import type { MapRef } from 'react-map-gl/maplibre'
import * as maplibregl from 'maplibre-gl'
import mapWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url'
import { MapControlsContext } from './components/MapControlsContext'
import { FlightPlaneLayer } from './flyover/components/FlightPlaneLayer'
import { FlyoverControlPanel } from './flyover/components/FlyoverControlPanel'
import { MapPoiClusterMarker } from './components/MapPoiClusterMarker'
import { MapPoiMarker, type MapPoi } from './components/MapPoiMarker'
import { MapPoiSelector } from './components/MapPoiSelector'
import { clusterMapPois } from './map-functions/clusterMapPois'
import {
  DEFAULT_POI_SETTINGS,
  isDefaultPoiId,
  POI_NAVIGATION_DURATION,
} from './map-settings/defaultPOISettings'
import { FLYOVER_MARKER_UPDATE_INTERVAL } from './map-settings/flyoverSettings'
import {
  DEFAULT_POI_CLUSTER_RADIUS,
  POI_CLUSTER_ZOOM_OVERSHOOT,
  POI_CLUSTER_ZOOM_DURATION,
} from './map-settings/poiClusterSettings'
import banffLandscape from './assets/banff-landscape.jpg'
import dinosaurBadlands from './assets/dinosaur-badlands.jpg'
import watertonLakes from './assets/waterton-lakes.jpg'
import { useMapInfoPanel } from '@/module-tools/map-info-panel/hooks/useMapInfoPanel'
import { useAppStartupMapGate } from '@/app/AppStartupMapContext'
import { useAlbertaMapController } from './map-functions/useAlbertaMapController'
import 'maplibre-gl/dist/maplibre-gl.css'

maplibregl.setWorkerUrl(mapWorkerUrl)

type AlbertaMapProps = {
  ariaLabel: string
  moduleId?: string
  modulePois?: readonly MapPoi[]
  defaultPoisVisible?: boolean
  modulePoisVisible?: boolean
  children?: ReactNode
}

// Function: Render MapLibre and provide its controls to the explore-page UI.
export function AlbertaMap({
  ariaLabel,
  moduleId,
  modulePois = [],
  defaultPoisVisible = true,
  modulePoisVisible = true,
  children,
}: AlbertaMapProps) {
  const { t } = useTranslation('mapping')
  const [areDefaultPoisVisible, setAreDefaultPoisVisible] =
    useState(defaultPoisVisible)
  const [areModulePoisVisible, setAreModulePoisVisible] =
    useState(modulePoisVisible)
  const [poiClusterRadius, setPoiClusterRadius] = useState(
    DEFAULT_POI_CLUSTER_RADIUS,
  )
  const [clusterViewport, setClusterViewport] = useState<{
    zoom: number
    center: [number, number]
  } | null>(null)
  const [activePoiId, setActivePoiId] = useState<string | null>(null)
  const { openPanel, closePanel } = useMapInfoPanel()
  const startupMapGate = useAppStartupMapGate()
  const {
    controls,
    flyover,
    mapRef,
    mapInstance,
    initialMapView,
    mapStyle,
    minZoom,
    maxZoom,
    onMapLoad,
    onMapAvailable,
    onMapError,
  } = useAlbertaMapController()

  const mapRefCallback = useCallback(
    (map: MapRef | null) => {
      mapRef.current = map
      onMapAvailable(map?.getMap() ?? null)
    },
    [mapRef, onMapAvailable],
  )

  const defaultPois = useMemo(
    () =>
      DEFAULT_POI_SETTINGS.map((poi) => {
        const title = t(poi.labelKey)
        const imageKey = 'imageKey' in poi ? poi.imageKey : undefined
        const descriptionKey =
          'descriptionKey' in poi ? poi.descriptionKey : undefined
        const imageAltKey = 'imageAltKey' in poi ? poi.imageAltKey : undefined
        const image = imageKey
          ? {
              banff: banffLandscape,
              dinosaurProvincialPark: dinosaurBadlands,
              watertonLakes,
            }[imageKey]
          : undefined

        return {
          id: poi.id,
          coordinates: poi.location,
          title,
          info: descriptionKey ? (
            <div className="space-y-4">
              {image && (
                <img
                  src={image}
                  alt={imageAltKey ? t(imageAltKey) : ''}
                  className="mapping-poi-info-image"
                />
              )}
              <p>{t(descriptionKey)}</p>
            </div>
          ) : undefined,
        }
      }),
    [t],
  )
  const visiblePois = useMemo(
    () => [
      ...(areDefaultPoisVisible ? defaultPois : []),
      ...(areModulePoisVisible ? modulePois : []),
    ],
    [areDefaultPoisVisible, areModulePoisVisible, defaultPois, modulePois],
  )
  const visibleActivePoiId = visiblePois.some((poi) => poi.id === activePoiId)
    ? activePoiId
    : (visiblePois[0]?.id ?? null)
  const poiGroups = useMemo(() => {
    if (!mapInstance && !controls.hasMapError) return []

    return clusterMapPois(
      visiblePois,
      mapInstance,
      poiClusterRadius,
      clusterViewport?.zoom,
    )
  }, [
    clusterViewport,
    controls.hasMapError,
    mapInstance,
    poiClusterRadius,
    visiblePois,
  ])
  const isPoiDataReady =
    mapInstance !== null && (visiblePois.length === 0 || poiGroups.length > 0)

  useEffect(() => {
    if (controls.isMapReady || controls.hasMapError || isPoiDataReady) {
      startupMapGate?.markMapReady()
    }
  }, [
    controls.hasMapError,
    controls.isMapReady,
    isPoiDataReady,
    startupMapGate,
  ])

  const isFlyoverEnabled = controls.isFlyoverEnabled

  useEffect(() => {
    if (!mapInstance) return

    let lastUpdate = 0
    let hasSkippedUpdate = false
    const updateClusterViewport = () => {
      const { lng, lat } = mapInstance.getCenter()
      setClusterViewport({
        zoom: mapInstance.getZoom(),
        center: [lng, lat],
      })
    }
    // Function: Regroup markers on every move, but only periodically while flying.
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
      updateClusterViewport()
    }

    mapInstance.on('move', handleMove)
    return () => {
      mapInstance.off('move', handleMove)
      if (hasSkippedUpdate) updateClusterViewport()
    }
  }, [isFlyoverEnabled, mapInstance])

  const navigateToPoi = (poi: MapPoi, origin?: Element | null) => {
    // While flying, selecting a marker carries the plane toward it instead.
    if (isFlyoverEnabled) {
      controls.onFlyoverTravelTo(poi.coordinates)
      return
    }

    setActivePoiId(poi.id)
    if (isDefaultPoiId(poi.id)) {
      controls.onNavigateToPoi(poi.id)
    } else {
      mapRef.current?.flyTo({
        center: poi.coordinates,
        zoom: 12,
        pitch: controls.isTerrainEnabled ? 50 : 0,
        duration: POI_NAVIGATION_DURATION,
      })
      poi.onActivate?.()
    }

    if (poi.info) {
      openPanel({ title: poi.title, content: poi.info }, { origin })
    } else {
      closePanel({ restoreFocus: false })
    }
  }

  const mapControls = {
    ...controls,
    defaultPoisVisible: areDefaultPoisVisible,
    modulePoisVisible: areModulePoisVisible,
    hasModulePois: modulePois.length > 0,
    poiClusterRadius,
    onDefaultPoisChange: setAreDefaultPoisVisible,
    onModulePoisChange: setAreModulePoisVisible,
    onPoiClusterRadiusChange: setPoiClusterRadius,
  }

  const zoomToPoiCluster = (
    coordinates: [number, number],
    expansionZoom: number,
  ) => {
    if (isFlyoverEnabled) {
      controls.onFlyoverTravelTo(coordinates)
      return
    }

    const map = mapRef.current?.getMap()
    if (!map) return

    map.easeTo({
      center: coordinates,
      zoom: Math.min(maxZoom, expansionZoom + POI_CLUSTER_ZOOM_OVERSHOOT),
      duration: POI_CLUSTER_ZOOM_DURATION,
    })
  }

  return (
    <MapControlsContext.Provider value={mapControls}>
      <div
        role="region"
        aria-label={ariaLabel}
        data-module-id={moduleId}
        className="absolute inset-0"
      >
        <Map
          ref={mapRefCallback}
          mapLib={maplibregl}
          initialViewState={initialMapView}
          mapStyle={mapStyle}
          minZoom={minZoom}
          maxZoom={maxZoom}
          style={{ width: '100%', height: '100%' }}
          onLoad={(event) => {
            const map = event.target
            const { lng, lat } = map.getCenter()
            setClusterViewport({ zoom: map.getZoom(), center: [lng, lat] })
            onMapLoad(map)
          }}
          onError={(event) => onMapError(event.error)}
        >
          {!isFlyoverEnabled && (
            <NavigationControl
              position="bottom-right"
              showCompass
              visualizePitch
            />
          )}
          {poiGroups.map((group) => {
            if (group.type === 'cluster') {
              return (
                <MapPoiClusterMarker
                  key={group.id}
                  coordinates={group.coordinates}
                  count={group.pois.length}
                  isActive={group.pois.some(
                    (poi) => poi.id === visibleActivePoiId,
                  )}
                  onClick={() =>
                    zoomToPoiCluster(group.coordinates, group.expansionZoom)
                  }
                />
              )
            }

            const { poi } = group

            return (
              <MapPoiMarker
                key={group.id}
                {...poi}
                isActive={visibleActivePoiId === poi.id}
                onActivate={(origin) => navigateToPoi(poi, origin)}
              />
            )
          })}
        </Map>

        {!isFlyoverEnabled && (
          <MapPoiSelector
            pois={visiblePois}
            activePoiId={visibleActivePoiId}
            onSelect={navigateToPoi}
          />
        )}
        {flyover.phase !== 'off' && (
          <FlightPlaneLayer visualRef={flyover.visualRef} />
        )}
        {(flyover.phase === 'entering' || flyover.phase === 'flying') && (
          <FlyoverControlPanel
            isPaused={flyover.isPaused}
            altitudeMeters={flyover.altitudeMeters}
            speedMetersPerSecond={flyover.speedMetersPerSecond}
          />
        )}
        {children}
      </div>
    </MapControlsContext.Provider>
  )
}
