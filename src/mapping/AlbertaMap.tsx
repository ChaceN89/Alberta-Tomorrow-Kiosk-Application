/**
  File: AlbertaMap.tsx | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Coordinate map state, POI navigation, and the map-specific helper layers.

  Usage:
  - Used by default and module-specific explore views.
  - The parent must provide a positioned container with a defined height.

  Notes:
  - Focused map behavior and rendering live in map-components/.
 */
import { useCallback, useEffect, useEffectEvent, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { isFlightShortcutIgnored } from './flyover/utils/flightKeyboard'
import type { MapRef } from 'react-map-gl/maplibre'
import type { Map as MapLibreMap } from 'maplibre-gl'
import { MapControlsContext } from './components/MapControlsContext'
import { isBasePoiId } from '@/mapping/POIs/BasePOIList'
import { useAlbertaDiscoveries } from '@/save-data/alberta-discoveries/useAlbertaDiscoveries'
import { useJournal } from '@/journal/context/useJournal'
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
import { useFlyoverPoiVisits } from './flyover/hooks/useFlyoverPoiVisits'
import { usePlaneLaunchShortcut } from './flyover/hooks/usePlaneLaunchShortcut'
import { getNextFlightPoi } from './flyover/utils/flightPoiNavigation'

// AlbertaMap component coordinates map state, POI navigation, and helper layers.
type AlbertaMapProps = {
  ariaLabel: string // Accessible label for the map container
  moduleId?: string // Optional module identifier for the map context
  modulePois?: readonly MapPoi[] // POIs specific to the module
  defaultPoisVisible?: boolean // Whether default POIs are visible
  modulePoisVisible?: boolean // Whether module-specific POIs are visible
  moduleStartup?: ModuleMapStartup // Startup configuration for the module map
  startFlyover?: boolean // One-time base-map launch requested by navigation.
  children?: ReactNode
}

const EMPTY_MODULE_POIS: readonly MapPoi[] = []

// main component for the albeta map
export function AlbertaMap({
  ariaLabel,
  moduleId,
  modulePois = EMPTY_MODULE_POIS,
  defaultPoisVisible = true,
  modulePoisVisible = true,
  moduleStartup,
  startFlyover = false,
  children,
}: AlbertaMapProps) {
  // State for the currently active POI on the map
  const [activePoiId, setActivePoiId] = useState<string | null>(null)
  const isExplicitPoiNavigation = useRef(false)

  // use state for the map info panell popout
  const {
    isOpen: isInfoPanelOpen,
    poiId: infoPoiId,
    openPanel,
    closePanel,
    updatePanel,
  } = useMapInfoPanel()

  // Startup map gate for coordinating map readiness with app startup - ensures the map is ready before proceeding with app initialization
  const startupMapGate = useAppStartupMapGate()

  // Alberta map controller for managing map state, flyover, and map instance references
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
    resetMapSettings,
    resetInitialSpawn,
  } = useAlbertaMapController(
    moduleStartup?.startSatellite === true,
    !moduleId,
    startFlyover,
  )

  // state for if the map viewport is currently being controlled by the flyover
  const mapViewport = useMapViewport(mapInstance, controls.isFlyoverEnabled)

  // use map POI data hook to manage visible POIs and clustering
  const poiData = useMapPoiData({
    modulePois,
    defaultPoisVisible,
    modulePoisVisible,
    mapInstance,
    hasMapError: controls.hasMapError,
    mapViewport: mapViewport.mapViewport,
  })

  const infoPoi = poiData.visiblePois.find((poi) => poi.id === infoPoiId)
  const { isOpen: isJournalOpen } = useJournal()
  const { onSetFlyoverPaused } = controls
  useEffect(() => {
    if (isJournalOpen && flyover.phase === 'flying' && !flyover.isPaused)
      onSetFlyoverPaused(true)
  }, [isJournalOpen, flyover.phase, flyover.isPaused, onSetFlyoverPaused])

  const { recordVisit } = useAlbertaDiscoveries()
  const visitPoiId = infoPoi?.id
  useEffect(() => {
    if (isInfoPanelOpen && visitPoiId && isBasePoiId(visitPoiId))
      recordVisit(visitPoiId)
  }, [isInfoPanelOpen, visitPoiId, recordVisit])
  useEffect(() => {
    if (!infoPoi) return
    updatePanel({
      poiId: infoPoi.id,
      title: infoPoi.title,
      content: infoPoi.info,
      isComplete: infoPoi.isModulePoi && infoPoi.isComplete,
    })
  }, [infoPoi, updatePanel])

  // Plane tutorial state for managing the tutorial overlay and controls
  const planeTutorial = usePlaneTutorialState({
    flyoverPhase: flyover.phase,
    isMapReady: controls.isMapReady,
    isStyleLoading: controls.isStyleLoading,
    onStartFlyover: controls.onStartFlyover,
    onSetFlyoverPaused: controls.onSetFlyoverPaused,
  })

  // Map view actions for handling map resets, flyover controls, and tutorial steps
  const { onResetMapView, isResettingMap, isPreparingFlyover } =
    useMapViewActions({
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
      onResetComplete: resetInitialSpawn,
      onResetMapSettings: async () => {
        closePanel({ restoreFocus: false })
        setActivePoiId(null)
        poiData.resetPoiSettings()
        return resetMapSettings()
      },
      setIsPlaneTutorialControlsStep:
        planeTutorial.setIsPlaneTutorialControlsStep,
    })

  useFlyoverPoiVisits({
    pois: poiData.visiblePois,
    phase: flyover.phase,
    isPaused: flyover.isPaused,
    isBlocked:
      isJournalOpen ||
      isResettingMap ||
      controls.isStyleLoading ||
      planeTutorial.isPlaneTutorialActive,
    isPanelOpen: isInfoPanelOpen,
    flightPositionRef: flyover.positionRef,
    onEnter: (poi, coordinates) => {
      isExplicitPoiNavigation.current = false
      flyover.pauseAtPosition(coordinates, poi.coordinates, poi.flyoverPoiFov)
      setActivePoiId(poi.id)
      poi.onActivate?.()
      openPanel({
        poiId: poi.id,
        title: poi.title,
        content: poi.info,
        isComplete: poi.isModulePoi && poi.isComplete,
      })
    },
    onResume: (visitedPoiId) => {
      if (!isExplicitPoiNavigation.current) {
        const next = getNextFlightPoi(poiData.visiblePois, visitedPoiId)
        if (next) setActivePoiId(next.id)
      }
      controls.onSetFlyoverPaused(false)
    },
  })

  const { clearPoiFocus } = flyover
  useEffect(() => {
    if (!isInfoPanelOpen) clearPoiFocus()
  }, [isInfoPanelOpen, clearPoiFocus])

  useEffect(() => {
    if (!isInfoPanelOpen || flyover.phase !== 'flying') return
    const resumeFromPoi = (event: KeyboardEvent) => {
      if (event.code !== 'KeyP' || isFlightShortcutIgnored(event)) return
      event.preventDefault()
      event.stopImmediatePropagation()
      if (!event.repeat) closePanel({ restoreFocus: false })
    }
    window.addEventListener('keydown', resumeFromPoi, true)
    return () => window.removeEventListener('keydown', resumeFromPoi, true)
  }, [isInfoPanelOpen, flyover.phase, closePanel])

  const launchPlane = () => {
    closePanel({ restoreFocus: false })
    controls.onStartFlyover(!planeTutorial.hasCompletedPlaneTour)
  }
  const autoLaunchHasRun = useRef(false)
  const autoLaunchPlane = useEffectEvent(launchPlane)
  useEffect(() => {
    if (
      !startFlyover ||
      moduleId ||
      autoLaunchHasRun.current ||
      !controls.isMapReady ||
      controls.isStyleLoading ||
      controls.isTerrainTransitioning ||
      isResettingMap ||
      flyover.phase !== 'off'
    )
      return
    autoLaunchHasRun.current = true
    autoLaunchPlane()
  }, [
    startFlyover,
    moduleId,
    controls.isMapReady,
    controls.isStyleLoading,
    controls.isTerrainTransitioning,
    isResettingMap,
    flyover.phase,
  ])
  usePlaneLaunchShortcut({
    isEnabled:
      controls.isMapReady &&
      !controls.isStyleLoading &&
      !controls.isTerrainTransitioning &&
      !isResettingMap &&
      flyover.phase === 'off',
    onLaunch: launchPlane,
  })

  // Collapse map attribution when appropriate
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
    if (isResettingMap) return
    if (controls.isFlyoverEnabled) {
      isExplicitPoiNavigation.current = true
      setActivePoiId(poi.id)
      closePanel({ restoreFocus: false })
      controls.onFlyoverTravelTo(poi.coordinates)
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
      openPanel(
        {
          poiId: poi.id,
          title: poi.title,
          content: poi.info,
          isComplete: poi.isModulePoi && poi.isComplete,
        },
        { origin },
      )
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
    if (isResettingMap) return
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
    isFlyoverPaused: flyover.isPaused,
    onResetMapView,
    isResettingMap,
    onToggleFlyover: () => {
      if (controls.isFlyoverEnabled) {
        planeTutorial.setIsPlaneTutorialControlsStep(false)
        controls.onToggleFlyover()
      } else {
        launchPlane()
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
        infoPoiId={infoPoiId}
        flightPositionRef={flyover.positionRef}
        onPoiActivate={navigateToPoi}
        onClusterActivate={zoomToPoiCluster}
        pois={poiData.visiblePois}
        activePoiId={visibleActivePoiId}
        onPoiSelect={(poi) => {
          isExplicitPoiNavigation.current = true
          setActivePoiId(poi.id)
        }}
        onPoiLocate={navigateToPoi}
        isFlyoverActive={flyover.phase !== 'off'}
        isPreparingFlyover={isPreparingFlyover}
        isFreeLooking={flyover.isFreeLooking}
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
