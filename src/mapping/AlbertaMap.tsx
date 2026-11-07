/**
  File: AlbertaMap.tsx | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Render the shared Alberta map, its controls, and default POI content.

  Usage:
  - Used by default and module-specific explore views.
  - The parent must provide a positioned container with a defined height.

  Notes:
  - Map state and behavior are managed by useAlbertaMapController.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { AttributionControl, Map } from 'react-map-gl/maplibre'
import type { MapRef } from 'react-map-gl/maplibre'
import * as maplibregl from 'maplibre-gl'
import mapWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url'
import { MapControlsContext } from './components/MapControlsContext'
import { FlightPlaneLayer } from './flyover/components/FlightPlaneLayer'
import { PlaneHud } from './flyover/components/PlaneHud'
import { MapPoiClusterMarker } from './components/MapPoiClusterMarker'
import { MapPoiMarker, type MapPoi } from './components/MapPoiMarker'
import { MapPoiSelector } from './components/MapPoiSelector'
import { clusterMapPois } from './map-functions/clusterMapPois'
import { getAnimationDuration } from './map-functions/mapAnimationFunctions'
import {
  DEFAULT_POI_SETTINGS,
  isDefaultPoiId,
  POI_NAVIGATION_DURATION,
} from './map-settings/defaultPOISettings'
import { defaultPoiContent } from './poi-content'
import { FLYOVER_MARKER_UPDATE_INTERVAL } from './map-settings/flyoverSettings'
import {
  DEFAULT_POI_CLUSTER_RADIUS,
  POI_CLUSTER_ZOOM_OVERSHOOT,
  POI_CLUSTER_ZOOM_DURATION,
} from './map-settings/poiClusterSettings'
import banffLandscape from './assets/banff-landscape.jpg'
import dinosaurBadlands from './assets/dinosaur-badlands.jpg'
import watertonLakes from './assets/waterton-lakes.jpg'
import { DEFAULT_POI_VIDEO_TRACKS } from './defaultPoiVideos'
import { useMapInfoPanel } from '@/module-tools/map-info-panel/hooks/useMapInfoPanel'
import { TrackPlayButton } from '@/module-tools/media-player/components/TrackPlayButton'
import { useAppStartupMapGate } from '@/app/AppStartupMapContext'
import { useAlbertaMapController } from './map-functions/useAlbertaMapController'
import {
  hasCompletedPlaneTutorial,
  PLANE_TUTORIAL_STORAGE_EVENT,
  resetPlaneTutorial,
} from '@/save-data/tutorial-progress/planeTutorialStorage'
import { ExploreMapTutorial } from '@/tutorials/specific-tutorials/explore-map/ExploreMapTutorial'
import { PlaneTutorial } from '@/tutorials/specific-tutorials/plane-tutorial/PlaneTutorial'
import { PLANE_TUTORIAL_START_REQUEST } from '@/tutorials/specific-tutorials/plane-tutorial/planeTutorialEvents'
import type { ModuleMapStartup } from '@/modules/types'
import 'maplibre-gl/dist/maplibre-gl.css'

maplibregl.setWorkerUrl(mapWorkerUrl)

type AlbertaMapProps = {
  ariaLabel: string
  moduleId?: string
  modulePois?: readonly MapPoi[]
  defaultPoisVisible?: boolean
  modulePoisVisible?: boolean
  moduleStartup?: ModuleMapStartup
  children?: ReactNode
}

function getMapInfoPanelCameraOffset(
  mapContainer: HTMLElement,
): [number, number] {
  const panel = document.querySelector<HTMLElement>('.map-info-panel')
  if (!panel) return [0, 0]

  const mapBounds = mapContainer.getBoundingClientRect()
  const panelWidth = panel.getBoundingClientRect().width
  const panelInset = Number.parseFloat(
    window.getComputedStyle(panel).insetInlineEnd,
  )
  const panelLeft =
    window.innerWidth -
    (Number.isFinite(panelInset) ? panelInset : 0) -
    panelWidth
  const visibleRightEdge = Math.max(
    mapBounds.left,
    Math.min(mapBounds.right, panelLeft),
  )
  const unobstructedCenter = (mapBounds.left + visibleRightEdge) / 2
  const mapCenter = (mapBounds.left + mapBounds.right) / 2

  return [unobstructedCenter - mapCenter, 0]
}

// Function: Render MapLibre and provide its controls to the explore-page UI.
export function AlbertaMap({
  ariaLabel,
  moduleId,
  modulePois = [],
  defaultPoisVisible = true,
  modulePoisVisible = true,
  moduleStartup,
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
  const [isPlaneTutorialControlsStep, setIsPlaneTutorialControlsStep] =
    useState(false)
  const [hasCompletedPlaneTour, setHasCompletedPlaneTour] = useState(
    hasCompletedPlaneTutorial,
  )
  const pendingPlaneTutorialStart = useRef(false)
  const pendingMapReset = useRef(false)
  const pendingMapResetExitRequested = useRef(false)
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
  const {
    isMapReady,
    isStyleLoading,
    isTerrainTransitioning,
    onSetFlyoverPaused,
    onStartFlyover,
    onToggleFlyover,
  } = controls
  const moduleStartupHasRun = useRef(false)
  const onStartFlyoverRef = useRef(onStartFlyover)
  const onMapErrorRef = useRef(onMapError)

  useEffect(() => {
    onStartFlyoverRef.current = onStartFlyover
    onMapErrorRef.current = onMapError
  }, [onMapError, onStartFlyover])

  const resetMapToStart = useCallback(() => {
    const map = mapRef.current?.getMap()
    if (!map) return

    const center: [number, number] = [
      initialMapView.longitude,
      initialMapView.latitude,
    ]
    const startView = moduleStartup?.view ?? {
      center,
      zoom: initialMapView.zoom,
      pitch: initialMapView.pitch,
      bearing: initialMapView.bearing,
    }

    try {
      map.flyTo({
        ...startView,
        duration: getAnimationDuration(POI_NAVIGATION_DURATION),
      })
    } catch (error) {
      onMapErrorRef.current(error)
    }
  }, [
    initialMapView.bearing,
    initialMapView.latitude,
    initialMapView.longitude,
    initialMapView.pitch,
    initialMapView.zoom,
    mapRef,
    moduleStartup?.view,
  ])

  const onResetMapView = useCallback(() => {
    if (!isMapReady || isStyleLoading || isTerrainTransitioning) {
      return
    }

    if (flyover.phase === 'off') {
      pendingMapReset.current = false
      pendingMapResetExitRequested.current = false
      resetMapToStart()
      return
    }

    pendingMapReset.current = true
    setIsPlaneTutorialControlsStep(false)
    pendingMapResetExitRequested.current = flyover.phase === 'flying'
    if (pendingMapResetExitRequested.current) onToggleFlyover()
  }, [
    isMapReady,
    isStyleLoading,
    isTerrainTransitioning,
    onToggleFlyover,
    flyover.phase,
    resetMapToStart,
  ])

  useEffect(() => {
    if (!pendingMapReset.current) return
    if (flyover.phase === 'flying') {
      if (!pendingMapResetExitRequested.current) {
        pendingMapResetExitRequested.current = true
        onToggleFlyover()
      }
      return
    }
    if (flyover.phase !== 'off') return

    pendingMapReset.current = false
    pendingMapResetExitRequested.current = false
    resetMapToStart()
  }, [onToggleFlyover, flyover.phase, resetMapToStart])

  const mapRefCallback = useCallback(
    (map: MapRef | null) => {
      mapRef.current = map
      onMapAvailable(map?.getMap() ?? null)
    },
    [mapRef, onMapAvailable],
  )

  useEffect(() => {
    if (!mapInstance) return

    // Let the credits appear briefly before collapsing the compact control.
    const timer = window.setTimeout(() => {
      const attribution = mapInstance
        .getContainer()
        .querySelector<HTMLElement>(
          '.maplibregl-ctrl-top-right .maplibregl-ctrl-attrib',
        )
      if (!attribution?.classList.contains('maplibregl-compact-show')) return

      attribution
        .querySelector<HTMLElement>('.maplibregl-ctrl-attrib-button')
        ?.click()
    }, 5000)

    return () => window.clearTimeout(timer)
  }, [mapInstance])

  const defaultPois = useMemo(
    () =>
      DEFAULT_POI_SETTINGS.map((poi) => {
        const title = t(poi.titleKey)
        const PoiContent = defaultPoiContent[poi.id]
        const imageKey = 'imageKey' in poi ? poi.imageKey : undefined
        const descriptionKey =
          'descriptionKey' in poi ? poi.descriptionKey : undefined
        const imageAltKey = 'imageAltKey' in poi ? poi.imageAltKey : undefined
        const videoTrack = DEFAULT_POI_VIDEO_TRACKS[poi.id]
        const image = imageKey
          ? {
              banff: banffLandscape,
              dinosaurProvincialPark: dinosaurBadlands,
              watertonLakes,
            }[imageKey]
          : undefined

        return {
          id: poi.id,
          coordinates: poi.coordinates,
          title,
          info: PoiContent ? (
            <PoiContent />
          ) : (
            <div className="space-y-4">
              {image && (
                <img
                  src={image}
                  alt={imageAltKey ? t(imageAltKey) : ''}
                  className="mapping-poi-info-image"
                />
              )}
              <p>
                {descriptionKey
                  ? t(descriptionKey)
                  : t('view.defaultPoiInfo.genericDescription')}
              </p>
              {videoTrack && <TrackPlayButton track={videoTrack} />}
            </div>
          ),
        }
      }),
    [t],
  )

  useEffect(() => {
    if (
      !moduleId ||
      !moduleStartup ||
      !controls.isMapReady ||
      controls.isStyleLoading ||
      controls.isTerrainTransitioning ||
      moduleStartupHasRun.current
    ) {
      return
    }

    const map = mapRef.current?.getMap()
    if (!map) return

    moduleStartupHasRun.current = true
    let isEffectActive = true
    const startFlyoverAfterArrival = () => {
      if (!isEffectActive) return

      map.off('moveend', startFlyoverAfterArrival)
      if (moduleStartup.startFlyover) onStartFlyoverRef.current(false)
    }

    if (moduleStartup.startFlyover) {
      map.once('moveend', startFlyoverAfterArrival)
    }

    try {
      map.flyTo({
        ...moduleStartup.view,
        duration: POI_NAVIGATION_DURATION,
      })
      if (!map.isMoving()) startFlyoverAfterArrival()
    } catch (error) {
      map.off('moveend', startFlyoverAfterArrival)
      moduleStartupHasRun.current = false
      onMapErrorRef.current(error)
    }

    return () => {
      isEffectActive = false
      map.off('moveend', startFlyoverAfterArrival)
    }
  }, [
    controls.isMapReady,
    controls.isStyleLoading,
    controls.isTerrainTransitioning,
    mapRef,
    moduleId,
    moduleStartup,
  ])
  const visiblePois = useMemo(() => {
    const poisById = new globalThis.Map<string, MapPoi>()

    if (areDefaultPoisVisible) {
      defaultPois.forEach((poi) => poisById.set(poi.id, poi))
    }

    if (areModulePoisVisible) {
      modulePois.forEach((poi) => {
        const defaultPoi = poisById.get(poi.id)
        poisById.set(
          poi.id,
          defaultPoi
            ? { ...defaultPoi, ...poi, info: poi.info ?? defaultPoi.info }
            : poi,
        )
      })
    }

    return [...poisById.values()]
  }, [areDefaultPoisVisible, areModulePoisVisible, defaultPois, modulePois])
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
    const syncCompletion = () =>
      setHasCompletedPlaneTour(hasCompletedPlaneTutorial())

    window.addEventListener(PLANE_TUTORIAL_STORAGE_EVENT, syncCompletion)
    return () =>
      window.removeEventListener(PLANE_TUTORIAL_STORAGE_EVENT, syncCompletion)
  }, [])

  useEffect(() => {
    const startPlaneTutorial = () => {
      resetPlaneTutorial()
      setHasCompletedPlaneTour(false)
      setIsPlaneTutorialControlsStep(false)

      if (flyover.phase === 'off') {
        if (controls.isMapReady && !controls.isStyleLoading) {
          onStartFlyover(true)
        } else {
          pendingPlaneTutorialStart.current = true
        }
      } else if (flyover.phase === 'exiting') {
        pendingPlaneTutorialStart.current = true
      } else {
        onSetFlyoverPaused(true)
      }
    }

    window.addEventListener(PLANE_TUTORIAL_START_REQUEST, startPlaneTutorial)
    return () =>
      window.removeEventListener(
        PLANE_TUTORIAL_START_REQUEST,
        startPlaneTutorial,
      )
  }, [
    controls.isMapReady,
    controls.isStyleLoading,
    flyover.phase,
    onSetFlyoverPaused,
    onStartFlyover,
  ])

  useEffect(() => {
    if (
      flyover.phase !== 'off' ||
      !controls.isMapReady ||
      controls.isStyleLoading ||
      !pendingPlaneTutorialStart.current
    ) {
      return
    }

    pendingPlaneTutorialStart.current = false
    onStartFlyover(true)
  }, [
    controls.isMapReady,
    controls.isStyleLoading,
    flyover.phase,
    onStartFlyover,
  ])

  const isPlaneTutorialActive =
    (flyover.phase === 'entering' || flyover.phase === 'flying') &&
    !hasCompletedPlaneTour

  const finishPlaneTutorial = () => {
    setHasCompletedPlaneTour(true)
    setIsPlaneTutorialControlsStep(false)
  }

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

    updateClusterViewport()
    mapInstance.on('move', handleMove)
    return () => {
      mapInstance.off('move', handleMove)
      if (hasSkippedUpdate) updateClusterViewport()
    }
  }, [isFlyoverEnabled, mapInstance])

  const navigateToPoi = (poi: MapPoi, origin?: Element | null) => {
    // While flying, selecting a marker carries the plane toward it instead.
    if (isFlyoverEnabled) {
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
      if (isDefaultPoiId(poi.id)) {
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

  const mapControls = {
    ...controls,
    onResetMapView,
    onToggleFlyover: () => {
      if (controls.isFlyoverEnabled) {
        setIsPlaneTutorialControlsStep(false)
        controls.onToggleFlyover()
      } else {
        controls.onStartFlyover(!hasCompletedPlaneTour)
      }
    },
    onStartFlyover: (pauseAfterEntry: boolean) =>
      controls.onStartFlyover(pauseAfterEntry),
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
          attributionControl={false}
          style={{ width: '100%', height: '100%' }}
          onLoad={(event) => {
            const map = event.target
            const { lng, lat } = map.getCenter()
            setClusterViewport({ zoom: map.getZoom(), center: [lng, lat] })
            onMapLoad(map)
          }}
          onError={(event) => onMapError(event.error)}
        >
          <AttributionControl
            position="top-right"
            compact
            customAttribution='<a href="https://maplibre.org/" target="_blank" rel="noopener">MapLibre</a>'
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
                onActivate={(origin) => navigateToPoi(poi, origin)}
              />
            )
          })}
        </Map>

        <MapPoiSelector
          pois={visiblePois}
          activePoiId={visibleActivePoiId}
          onSelect={navigateToPoi}
        />
        {flyover.phase !== 'off' && (
          <FlightPlaneLayer visualRef={flyover.visualRef} />
        )}
        <PlaneHud
          isActive={flyover.phase !== 'off'}
          isPaused={flyover.isPaused}
          altitudeMeters={flyover.altitudeMeters}
          speedMetersPerSecond={flyover.speedMetersPerSecond}
          latitude={clusterViewport?.center[1] ?? initialMapView.latitude}
          longitude={clusterViewport?.center[0] ?? initialMapView.longitude}
          isTutorialActive={isPlaneTutorialActive}
          isTutorialControlsStep={isPlaneTutorialControlsStep}
        />
        {isPlaneTutorialActive && (
          <PlaneTutorial
            onFinish={finishPlaneTutorial}
            onPause={controls.onSetFlyoverPaused}
            onControlsStepChange={setIsPlaneTutorialControlsStep}
          />
        )}
        <ExploreMapTutorial isMapReady={controls.isMapReady} />
        {children}
      </div>
    </MapControlsContext.Provider>
  )
}
