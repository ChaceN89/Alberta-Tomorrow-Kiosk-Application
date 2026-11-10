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
import { useMapStartup } from './map-components/useMapStartup'
import { MapLoadingScreen } from './components/MapLoadingScreen'
import { MAP_REVEAL_DURATION_MS } from './map-settings/mapLoadingSettings'
import { loadFlightPlaneOverlay } from './flyover/utils/preloadFlightPlane'

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
export function AlbertaMap(props: AlbertaMapProps) {
  const [attempt, setAttempt] = useState(0)
  return (
    <AlbertaMapScene
      key={attempt}
      {...props}
      onRetry={() => setAttempt((current) => current + 1)}
    />
  )
}

function AlbertaMapScene({
  ariaLabel,
  moduleId,
  modulePois = EMPTY_MODULE_POIS,
  defaultPoisVisible = true,
  modulePoisVisible = true,
  moduleStartup,
  startFlyover = false,
  children,
  onRetry,
}: AlbertaMapProps & { onRetry: () => void }) {
  const [isInteractive, setIsInteractive] = useState(false)
  const [isAircraftReady, setIsAircraftReady] = useState(false)
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
    !isInteractive,
  )

  // state for if the map viewport is currently being controlled by the flyover
  const mapViewport = useMapViewport(mapInstance, controls.isFlyoverEnabled)

  // use map POI data hook to manage visible POIs and clustering
  const poiData = useMapPoiData({
    isFlyoverActive: flyover.phase !== 'off',
    isBaseMap: !moduleId,
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
    isMapReady: controls.isMapReady && isInteractive,
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
      isMapReady: controls.isMapReady && isInteractive,
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

  const startup = useMapStartup({
    onReady: () => setIsInteractive(true),
    map: mapInstance,
    isSetupReady:
      controls.isMapReady &&
      !controls.isStyleLoading &&
      !controls.isTerrainTransitioning,
    isCameraReady: !isResettingMap && flyover.phase === 'off',
    isPoiDataReady: poiData.isPoiDataReady,
    needsAircraft: startFlyover || moduleStartup?.startFlyover === true,
    isAircraftReady,
    isBoundaryEnabled: controls.isAlbertaBoundaryEnabled,
    isWallEnabled: controls.isAlbertaBoundaryWallEnabled,
  })
  const { fail: failStartup } = startup
  useEffect(() => {
    if (!startFlyover && !moduleStartup?.startFlyover) return
    let active = true
    void Promise.all([
      loadFlightPlaneOverlay(),
      import('./flyover/utils/planeModel').then((module) =>
        module.loadFlightPlane(),
      ),
    ]).then(
      () => {
        if (active) setIsAircraftReady(true)
      },
      (error: unknown) => {
        if (active) failStartup(error)
      },
    )
    return () => {
      active = false
    }
  }, [startFlyover, moduleStartup?.startFlyover, failStartup])
  useEffect(() => {
    if (controls.hasMapError && !isInteractive)
      failStartup(new Error('The map reported an error during startup.'))
  }, [controls.hasMapError, isInteractive, failStartup])

  useFlyoverPoiVisits({
    pois: poiData.visiblePois,
    phase: flyover.phase,
    isPaused: flyover.isPaused,
    isBlocked:
      !isInteractive ||
      isJournalOpen ||
      isResettingMap ||
      controls.isStyleLoading ||
      planeTutorial.isPlaneTutorialActive,
    isPanelOpen: isInfoPanelOpen,
    flightPositionRef: flyover.positionRef,
    getFlightElevation: flyover.getFlightElevation,
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
      flyover.resumeFromPoi()
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
      !isInteractive ||
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
    isInteractive,
    moduleId,
    controls.isMapReady,
    controls.isStyleLoading,
    controls.isTerrainTransitioning,
    isResettingMap,
    flyover.phase,
  ])
  usePlaneLaunchShortcut({
    isEnabled:
      isInteractive &&
      controls.isMapReady &&
      !controls.isStyleLoading &&
      !controls.isTerrainTransitioning &&
      !isResettingMap &&
      flyover.phase === 'off',
    onLaunch: launchPlane,
  })

  // Collapse map attribution when appropriate
  useMapAttributionCollapse(mapInstance)

  const mapRefCallback = useCallback(
    (map: MapRef | null) => {
      mapRef.current = map
      onMapAvailable(map?.getMap() ?? null)
    },
    [mapRef, onMapAvailable],
  )

  const visibleActivePoiId = poiData.selectablePois.some(
    (poi) => poi.id === activePoiId,
  )
    ? activePoiId
    : (poiData.selectablePois[0]?.id ?? null)

  const navigateToPoi = (poi: MapPoi, origin?: Element | null) => {
    if (!isInteractive || isResettingMap) return
    if (poi.isModuleEntry && !controls.isFlyoverEnabled) {
      isExplicitPoiNavigation.current = true
      setActivePoiId(poi.id)
      launchPlane()
      return
    }
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
    if (!isInteractive || isResettingMap) return
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
    isMapReady: controls.isMapReady && isInteractive,
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
    moduleEntriesVisible: poiData.areModuleEntriesVisible,
    onModuleEntriesChange: poiData.setAreModuleEntriesVisible,
    onSelectModuleEntry: (entryModuleId: string) => {
      isExplicitPoiNavigation.current = true
      poiData.setAreModuleEntriesVisible(true)
      setActivePoiId(`module-entry:${entryModuleId}`)
    },
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
      <div
        className={`absolute inset-0 transition-opacity motion-reduce:transition-none ${startup.isVisible ? 'opacity-100' : 'opacity-0'}`}
        style={{ transitionDuration: `${MAP_REVEAL_DURATION_MS}ms` }}
        inert={!isInteractive}
        aria-hidden={!isInteractive}
      >
        <AlbertaMapCanvas
          isInteractive={isInteractive}
          onAircraftReady={() => setIsAircraftReady(true)}
          onAircraftError={failStartup}
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
          getFlightElevation={flyover.getFlightElevation}
          onPoiActivate={navigateToPoi}
          onClusterActivate={zoomToPoiCluster}
          pois={poiData.visiblePois}
          selectorPois={poiData.selectablePois}
          activePoiId={visibleActivePoiId}
          onPoiSelect={(poi) => {
            isExplicitPoiNavigation.current = true
            setActivePoiId(poi.id)
          }}
          onPoiLocate={navigateToPoi}
          isFlyoverActive={flyover.phase !== 'off'}
          isFlyoverExiting={flyover.phase === 'exiting'}
          isPreparingFlyover={isPreparingFlyover}
          isFreeLooking={flyover.isFreeLooking}
          altitudeMeters={flyover.altitudeMeters}
          speedMetersPerSecond={flyover.speedMetersPerSecond}
          latitude={
            mapViewport.mapViewport?.center[1] ?? initialMapView.latitude
          }
          longitude={
            mapViewport.mapViewport?.center[0] ?? initialMapView.longitude
          }
          visualRef={flyover.visualRef}
          isPlaneTutorialActive={planeTutorial.isPlaneTutorialActive}
          isPlaneTutorialControlsStep={
            planeTutorial.isPlaneTutorialControlsStep
          }
          isMapReady={controls.isMapReady}
          onFinishPlaneTutorial={planeTutorial.finishPlaneTutorial}
          onSetFlyoverPaused={controls.onSetFlyoverPaused}
          onPlaneTutorialControlsStepChange={
            planeTutorial.setIsPlaneTutorialControlsStep
          }
        >
          {children}
        </AlbertaMapCanvas>
      </div>
      {startup.isLoadingScreenVisible && (
        <MapLoadingScreen
          hasError={startup.state === 'error'}
          isRevealing={startup.state === 'revealing'}
          onRetry={onRetry}
        />
      )}
    </MapControlsContext.Provider>
  )
}
