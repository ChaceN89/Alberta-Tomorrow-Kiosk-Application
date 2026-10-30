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
import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Map, NavigationControl } from 'react-map-gl/maplibre'
import * as maplibregl from 'maplibre-gl'
import mapWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url'
import { MapControlsContext } from './components/MapControlsContext'
import { MapPoiClusterMarker } from './components/MapPoiClusterMarker'
import { MapPoiMarker, type MapPoi } from './components/MapPoiMarker'
import { MapPoiSelector } from './components/MapPoiSelector'
import { clusterMapPois } from './map-functions/clusterMapPois'
import {
  DEFAULT_POI_SETTINGS,
  isDefaultPoiId,
  POI_NAVIGATION_DURATION,
} from './map-settings/defaultPOISettings'
import {
  DEFAULT_POI_CLUSTER_RADIUS,
  POI_CLUSTER_ZOOM_OVERSHOOT,
  POI_CLUSTER_ZOOM_DURATION,
} from './map-settings/poiClusterSettings'
import banffLandscape from './assets/banff-landscape.jpg'
import dinosaurBadlands from './assets/dinosaur-badlands.jpg'
import watertonLakes from './assets/waterton-lakes.jpg'
import { useMapInfoPanel } from '@/module-tools/map-info-panel/hooks/useMapInfoPanel'
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
  const {
    controls,
    mapRef,
    mapInstance,
    initialMapView,
    mapStyle,
    minZoom,
    maxZoom,
    onMapLoad,
    onMapError,
  } = useAlbertaMapController()

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
          coordinates: poi.view.center,
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
  const poiGroups = useMemo(
    () =>
      clusterMapPois(
        visiblePois,
        mapInstance,
        poiClusterRadius,
        clusterViewport?.zoom,
      ),
    [clusterViewport, mapInstance, poiClusterRadius, visiblePois],
  )

  useEffect(() => {
    if (!mapInstance) return

    const updateClusterViewport = () => {
      const { lng, lat } = mapInstance.getCenter()
      setClusterViewport({
        zoom: mapInstance.getZoom(),
        center: [lng, lat],
      })
    }

    mapInstance.on('moveend', updateClusterViewport)
    return () => {
      mapInstance.off('moveend', updateClusterViewport)
    }
  }, [mapInstance])

  const navigateToPoi = (poi: MapPoi) => {
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
      openPanel({ title: poi.title, content: poi.info })
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
          ref={mapRef}
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
          <NavigationControl
            position="bottom-right"
            showCompass
            visualizePitch
          />
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
                onActivate={() => {
                  if (isDefaultPoiId(poi.id)) {
                    navigateToPoi(poi)
                    return
                  }

                  setActivePoiId(poi.id)
                  poi.onActivate?.()
                }}
              />
            )
          })}
        </Map>

        <MapPoiSelector
          pois={visiblePois}
          activePoiId={visibleActivePoiId}
          onSelect={navigateToPoi}
        />
        {children}
      </div>
    </MapControlsContext.Provider>
  )
}
