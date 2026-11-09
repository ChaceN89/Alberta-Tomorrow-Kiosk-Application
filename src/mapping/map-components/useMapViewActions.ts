/**
  File: useMapViewActions.ts | Author: Chace Nielson
  Date Created: Nov 8, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Coordinate startup camera movement, reset requests, and startup flyovers.

  Usage:
  - Used by AlbertaMap to provide its map reset control and module startup.

  Notes:
  - Reset exits flight, restores settings, and replays the configured startup.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
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
  onResetComplete: () => void
  onResetMapSettings: () => Promise<boolean>
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
  onResetComplete,
  onResetMapSettings,
  setIsPlaneTutorialControlsStep,
}: UseMapViewActionsOptions) {
  const pendingMapReset = useRef(false)
  const pendingMapResetExitRequested = useRef(false)
  const moduleStartupHasRun = useRef(false)
  const [isResettingMap, setIsResettingMap] = useState(false)
  const [isPreparingFlyover, setIsPreparingFlyover] = useState(
    Boolean(moduleStartup?.startFlyover),
  )
  const isMounted = useRef(false)
  const resetIsRunning = useRef(false)
  const cancelCameraMove = useRef<(() => void) | null>(null)
  const onStartFlyoverRef = useRef(onStartFlyover)
  const onMapErrorRef = useRef(onMapError)
  const onResetMapSettingsRef = useRef(onResetMapSettings)

  useEffect(() => {
    onStartFlyoverRef.current = onStartFlyover
    onMapErrorRef.current = onMapError
    onResetMapSettingsRef.current = onResetMapSettings
  }, [onMapError, onStartFlyover, onResetMapSettings])

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
      cancelCameraMove.current?.()
    }
  }, [])

  const resetMapToStart = useCallback((): Promise<boolean> => {
    const map = mapRef.current?.getMap()
    if (!map) return Promise.resolve(false)

    cancelCameraMove.current?.()

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

    return new Promise((resolve) => {
      const finish = (arrived: boolean) => {
        map.off('moveend', onArrival)
        cancelCameraMove.current = null
        resolve(arrived)
      }
      const onArrival = () => finish(true)
      cancelCameraMove.current = () => finish(false)
      try {
        map.stop()
        map.once('moveend', onArrival)
        map.flyTo({
          ...startView,
          duration: getAnimationDuration(POI_NAVIGATION_DURATION),
        })
        if (!map.isMoving()) onArrival()
      } catch (error) {
        finish(false)
        onMapErrorRef.current(error)
      }
    })
  }, [
    initialMapView.bearing,
    initialMapView.latitude,
    initialMapView.longitude,
    initialMapView.pitch,
    initialMapView.zoom,
    mapRef,
    moduleStartup?.view,
  ])

  const performReset = useCallback(async () => {
    if (resetIsRunning.current) return
    resetIsRunning.current = true
    try {
      if (!(await onResetMapSettingsRef.current()) || !isMounted.current) return
      // Allow the restored terrain and layer state to reach the flight controls.
      await new Promise<void>((resolve) =>
        window.requestAnimationFrame(() => resolve()),
      )
      if (!isMounted.current) return
      const arrived = await resetMapToStart()
      if (arrived && isMounted.current) onResetComplete()
      if (arrived && isMounted.current && moduleStartup?.startFlyover) {
        onStartFlyoverRef.current(false, moduleStartup.startSpeed)
      }
    } catch (error) {
      if (isMounted.current) onMapErrorRef.current(error)
    } finally {
      pendingMapReset.current = false
      pendingMapResetExitRequested.current = false
      resetIsRunning.current = false
      if (isMounted.current) setIsResettingMap(false)
    }
  }, [moduleStartup, onResetComplete, resetMapToStart])

  const onResetMapView = useCallback(() => {
    if (
      !isMapReady ||
      isStyleLoading ||
      isTerrainTransitioning ||
      pendingMapReset.current ||
      resetIsRunning.current
    )
      return

    cancelCameraMove.current?.()
    moduleStartupHasRun.current = true
    pendingMapReset.current = true
    setIsResettingMap(true)
    setIsPlaneTutorialControlsStep(false)
    if (flyoverPhase === 'off') {
      void performReset()
      return
    }
    pendingMapResetExitRequested.current = flyoverPhase === 'flying'
    if (pendingMapResetExitRequested.current) onToggleFlyover()
  }, [
    flyoverPhase,
    isMapReady,
    isStyleLoading,
    isTerrainTransitioning,
    onToggleFlyover,
    performReset,
    setIsPlaneTutorialControlsStep,
  ])

  useEffect(() => {
    if (!pendingMapReset.current || resetIsRunning.current) return
    if (flyoverPhase === 'flying') {
      if (!pendingMapResetExitRequested.current) {
        pendingMapResetExitRequested.current = true
        onToggleFlyover()
      }
      return
    }
    if (flyoverPhase !== 'off') return

    void performReset()
  }, [flyoverPhase, onToggleFlyover, performReset])

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

    moduleStartupHasRun.current = true
    let isEffectActive = true
    void resetMapToStart().then((arrived) => {
      if (arrived && isEffectActive && moduleStartup.startFlyover) {
        onStartFlyoverRef.current(false, moduleStartup.startSpeed)
      }
      if (isEffectActive) setIsPreparingFlyover(false)
    })

    return () => {
      isEffectActive = false
      cancelCameraMove.current?.()
    }
  }, [
    isMapReady,
    isStyleLoading,
    isTerrainTransitioning,
    moduleId,
    moduleStartup,
    resetMapToStart,
  ])

  return { onResetMapView, isResettingMap, isPreparingFlyover }
}
