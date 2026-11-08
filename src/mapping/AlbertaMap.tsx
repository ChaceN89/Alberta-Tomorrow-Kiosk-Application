/**
  File: AlbertaMap.tsx | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Nov 8, 2026

  Description:
  - Coordinate map state, POI navigation, and the map-specific helper layers.

  Usage:
  - Used by default and module-specific explore views.
  - The parent must provide a positioned container with a defined height.

  Notes:
  - Focused map behavior and rendering live in map-components/.
 */
import { useCallback, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { MapRef } from 'react-map-gl/maplibre'
import type { Map as MapLibreMap } from 'maplibre-gl'
import { MapControlsContext } from './components/MapControlsContext'
import { isBasePoiId } from '@/site-data/POIs/BasePOIList'
import { POI_NAVIGATION_DURATION } from './map-settings/mapSettings'
import {
  POI_CLUSTER_ZOOM_OVERSHOOT,
  POI_CLUSTER_ZOOM_DURATION,
} from './map-settings/poiClusterSettings'
import { useMapInfoPanel } from '@/module-tools/map-info-panel/hooks/useMapInfoPanel'
import { useAppStartupMapGate } from '@/app/AppStartupMapContext'
import { useAlbertaMapController } from './map-functions/useAlbertaMapController'
import type { ModuleMapStartup } from '@/modules/types'
import type { MapPoi } from './components/MapPoiMarker'
import { AlbertaMapCanvas } from './map-components/AlbertaMapCanvas'
import { getMapInfoPanelCameraOffset } from './map-components/mapInfoPanelCameraOffset'
import { useMapAttributionCollapse } from './map-components/useMapAttributionCollapse'
import { useMapPoiData } from './map-components/useMapPoiData'
import { useMapViewActions } from './map-components/useMapViewActions'
import { useMapViewport } from './map-components/useMapViewport'
import { usePlaneTutorialState } from './map-components/usePlaneTutorialState'

type AlbertaMapProps = {
  ariaLabel: string
  moduleId?: string
  modulePois?: readonly MapPoi[]
  defaultPoisVisible?: boolean
  modulePoisVisible?: boolean
  moduleStartup?: ModuleMapStartup
  children?: ReactNode
}

export function AlbertaMap({
  ariaLabel,
  moduleId,
  modulePois = [],
  defaultPoisVisible = true,
  modulePoisVisible = true,
  moduleStartup,
  children,
}: AlbertaMapProps) {
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
  const mapViewport = useMapViewport(mapInstance, controls.isFlyoverEnabled)
  const poiData = useMapPoiData({
    modulePois,
    defaultPoisVisible,
    modulePoisVisible,
    mapInstance,
    hasMapError: controls.hasMapError,
    mapViewport: mapViewport.mapViewport,
  })
  const planeTutorial = usePlaneTutorialState({
    flyoverPhase: flyover.phase,
    isMapReady: controls.isMapReady,
    isStyleLoading: controls.isStyleLoading,
    onStartFlyover: controls.onStartFlyover,
    onSetFlyoverPaused: controls.onSetFlyoverPaused,
  })
  const { onResetMapView } = useMapViewActions({
    moduleId,
    moduleStartup,
    mapRef,
    initialMapView,
    isMapReady: controls.isMapReady,
    isStyleLoading: controls.isStyleLoading,
    isTerrainTransitioning: controls.isTerrainTransitioning,
    flyoverPhase: flyover.phase,
    onStartFlyover: controls.onStartFlyover,
    onToggleFlyover: controls.onToggleFlyover,
    onMapError,
    setIsPlaneTutorialControlsStep:
      planeTutorial.setIsPlaneTutorialControlsStep,
  })

  useMapAttributionCollapse(mapInstance)

  useEffect(() => {
    if (controls.isMapReady || controls.hasMapError || poiData.isPoiDataReady) {
      startupMapGate?.markMapReady()
    }
  }, [
    controls.hasMapError,
    controls.isMapReady,
    poiData.isPoiDataReady,
    startupMapGate,
  ])

  const mapRefCallback = useCallback(
    (map: MapRef | null) => {
      mapRef.current = map
      onMapAvailable(map?.getMap() ?? null)
    },
    [mapRef, onMapAvailable],
  )

  const visibleActivePoiId = poiData.visiblePois.some(
    (poi) => poi.id === activePoiId,
  )
    ? activePoiId
    : (poiData.visiblePois[0]?.id ?? null)

  const navigateToPoi = (poi: MapPoi, origin?: Element | null) => {
    if (controls.isFlyoverEnabled) {
      setActivePoiId(poi.id)
      controls.onFlyoverTravelTo(poi.coordinates)
      poi.onActivate?.()
      if (poi.info) {
        openPanel({ title: poi.title, content: poi.info }, { origin })
      } else {
        closePanel({ restoreFocus: false })
      }
      return
    }

    setActivePoiId(poi.id)
    const navigateCamera = (offset: [number, number]) => {
      if (isBasePoiId(poi.id)) {
        controls.onNavigateToPoi(poi.id, offset)
      } else {
        mapRef.current?.flyTo({
          center: poi.coordinates,
          zoom: 12,
          pitch: controls.isTerrainEnabled ? 50 : 0,
          duration: POI_NAVIGATION_DURATION,
          offset,
        })
      }
      poi.onActivate?.()
    }

    if (poi.info) {
      openPanel({ title: poi.title, content: poi.info }, { origin })
      window.requestAnimationFrame(() => {
        const map = mapRef.current?.getMap()
        navigateCamera(
          map ? getMapInfoPanelCameraOffset(map.getContainer()) : [0, 0],
        )
      })
    } else {
      closePanel({ restoreFocus: false })
      navigateCamera([0, 0])
    }
  }

  const zoomToPoiCluster = (
    coordinates: [number, number],
    expansionZoom: number,
  ) => {
    if (controls.isFlyoverEnabled) {
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

  const mapControls = {
    ...controls,
    onResetMapView,
    onToggleFlyover: () => {
      if (controls.isFlyoverEnabled) {
        planeTutorial.setIsPlaneTutorialControlsStep(false)
        controls.onToggleFlyover()
      } else {
        controls.onStartFlyover(!planeTutorial.hasCompletedPlaneTour)
      }
    },
    onStartFlyover: (pauseAfterEntry: boolean) =>
      controls.onStartFlyover(pauseAfterEntry),
    defaultPoisVisible: poiData.areDefaultPoisVisible,
    modulePoisVisible: poiData.areModulePoisVisible,
    hasModulePois: modulePois.length > 0,
    poiClusterRadius: poiData.poiClusterRadius,
    onDefaultPoisChange: poiData.setAreDefaultPoisVisible,
    onModulePoisChange: poiData.setAreModulePoisVisible,
    onPoiClusterRadiusChange: poiData.setPoiClusterRadius,
  }

  const handleMapLoad = (map: MapLibreMap) => {
    mapViewport.updateMapViewport(map)
    onMapLoad(map)
  }

  return (
    <MapControlsContext.Provider value={mapControls}>
      <AlbertaMapCanvas
        ariaLabel={ariaLabel}
        moduleId={moduleId}
        initialMapView={initialMapView}
        mapStyle={mapStyle}
        minZoom={minZoom}
        maxZoom={maxZoom}
        mapRefCallback={mapRefCallback}
        onMapLoad={handleMapLoad}
        onMapError={onMapError}
        groups={poiData.poiGroups}
        onPoiActivate={navigateToPoi}
        onClusterActivate={zoomToPoiCluster}
        pois={poiData.visiblePois}
        activePoiId={visibleActivePoiId}
        onPoiSelect={navigateToPoi}
        isFlyoverActive={flyover.phase !== 'off'}
        isFlyoverPaused={flyover.isPaused}
        altitudeMeters={flyover.altitudeMeters}
        speedMetersPerSecond={flyover.speedMetersPerSecond}
        latitude={mapViewport.mapViewport?.center[1] ?? initialMapView.latitude}
        longitude={
          mapViewport.mapViewport?.center[0] ?? initialMapView.longitude
        }
        visualRef={flyover.visualRef}
        isPlaneTutorialActive={planeTutorial.isPlaneTutorialActive}
        isPlaneTutorialControlsStep={planeTutorial.isPlaneTutorialControlsStep}
        isMapReady={controls.isMapReady}
        onFinishPlaneTutorial={planeTutorial.finishPlaneTutorial}
        onSetFlyoverPaused={controls.onSetFlyoverPaused}
        onPlaneTutorialControlsStepChange={
          planeTutorial.setIsPlaneTutorialControlsStep
        }
      >
        {children}
      </AlbertaMapCanvas>
    </MapControlsContext.Provider>
  )
}
