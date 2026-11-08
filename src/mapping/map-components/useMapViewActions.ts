/**
  File: useMapViewActions.ts | Author: Chace Nielson
  Date Created: Nov 8, 2026
  Date Updated: Nov 8, 2026

  Description:
  - Coordinate startup camera movement, reset requests, and startup flyovers.

  Usage:
  - Used by AlbertaMap to provide its map reset control and module startup.

  Notes:
  - Reset requests wait for an active flyover to exit before moving the camera.
 */
import { useCallback, useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import type { MapRef } from 'react-map-gl/maplibre'
import type { ModuleMapStartup } from '@/modules/types'
import { getAnimationDuration } from '../map-functions/mapAnimationFunctions'
import { POI_NAVIGATION_DURATION } from '../map-settings/mapSettings'
import type { FlyoverPhase } from '../flyover/types'

type InitialMapView = {
  longitude: number
  latitude: number
  zoom: number
  pitch: number
  bearing: number
}

type UseMapViewActionsOptions = {
  moduleId?: string
  moduleStartup?: ModuleMapStartup
  mapRef: RefObject<MapRef | null>
  initialMapView: InitialMapView
  isMapReady: boolean
  isStyleLoading: boolean
  isTerrainTransitioning: boolean
  flyoverPhase: FlyoverPhase
  onStartFlyover: (pauseAfterEntry: boolean, startSpeed?: number) => void
  onToggleFlyover: () => void
  onMapError: (error: unknown) => void
  setIsPlaneTutorialControlsStep: (isControlsStep: boolean) => void
}

export function useMapViewActions({
  moduleId,
  moduleStartup,
  mapRef,
  initialMapView,
  isMapReady,
  isStyleLoading,
  isTerrainTransitioning,
  flyoverPhase,
  onStartFlyover,
  onToggleFlyover,
  onMapError,
  setIsPlaneTutorialControlsStep,
}: UseMapViewActionsOptions) {
  const pendingMapReset = useRef(false)
  const pendingMapResetExitRequested = useRef(false)
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
    if (!isMapReady || isStyleLoading || isTerrainTransitioning) return

    if (flyoverPhase === 'off') {
      pendingMapReset.current = false
      pendingMapResetExitRequested.current = false
      resetMapToStart()
      return
    }

    pendingMapReset.current = true
    setIsPlaneTutorialControlsStep(false)
    pendingMapResetExitRequested.current = flyoverPhase === 'flying'
    if (pendingMapResetExitRequested.current) onToggleFlyover()
  }, [
    flyoverPhase,
    isMapReady,
    isStyleLoading,
    isTerrainTransitioning,
    onToggleFlyover,
    resetMapToStart,
    setIsPlaneTutorialControlsStep,
  ])

  useEffect(() => {
    if (!pendingMapReset.current) return
    if (flyoverPhase === 'flying') {
      if (!pendingMapResetExitRequested.current) {
        pendingMapResetExitRequested.current = true
        onToggleFlyover()
      }
      return
    }
    if (flyoverPhase !== 'off') return

    pendingMapReset.current = false
    pendingMapResetExitRequested.current = false
    resetMapToStart()
  }, [flyoverPhase, onToggleFlyover, resetMapToStart])

  useEffect(() => {
    if (
      !moduleId ||
      !moduleStartup ||
      !isMapReady ||
      isStyleLoading ||
      isTerrainTransitioning ||
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
      if (moduleStartup.startFlyover) {
        onStartFlyoverRef.current(false, moduleStartup.startSpeed)
      }
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
    isMapReady,
    isStyleLoading,
    isTerrainTransitioning,
    mapRef,
    moduleId,
    moduleStartup,
  ])

  return { onResetMapView }
}
