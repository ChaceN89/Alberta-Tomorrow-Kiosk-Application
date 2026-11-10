/**
  File: useFlyoverControls.ts | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Run flyover mode: spawn the plane, fly it, and drive the map camera behind it.

  Usage:
  - Used by useAlbertaMapController.

  Notes:
  - Entering and exiting are transitions where the player has no control. While
    entering, the camera moves from the current view to the chase camera as the
    plane rises in from below. Exiting turns the plane off screen to the left
    while the camera zooms out to the configured exit view.
  - The camera follows a ground elevation smoothed from the terrain around the
    plane (see terrainSampler), not the exact height under the view center.
  - Flight data changes every frame, so it is kept in refs. React state only
    holds the values the interface shows.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import type { MapRef } from 'react-map-gl/maplibre'
import type { Map as MapLibreMap } from 'maplibre-gl'
import {
  FLYOVER_CAMERA_PITCH,
  FLYOVER_DEFAULT_SPEED,
  FLYOVER_ENTER_DURATION,
  FLYOVER_BASE_MAP_RELOCATION_DURATION,
  FLYOVER_EXIT_CAMERA_DURATION,
  FLYOVER_EXIT_DURATION,
  FLYOVER_EXIT_PITCH,
  FLYOVER_EXIT_ZOOM,
  FLYOVER_MAX_ALTITUDE_METERS,
  FLYOVER_MAX_FRAME_SECONDS,
  FLYOVER_MIN_ALTITUDE_METERS,
  FLYOVER_MAX_SPEED,
  FLYOVER_MIN_SPEED,
  FLYOVER_POI_ARRIVAL_VIEW_SCALE,
  FLYOVER_POI_ARRIVAL_SPEED,
  FLYOVER_POI_PEAK_ALTITUDE_RATIO,
  FLYOVER_POI_TRAVEL_DURATION,
  FLYOVER_START_ALTITUDE_METERS,
  FLYOVER_LINK_START_ALTITUDE_METERS,
  FLYOVER_START_BACKUP_SCALE,
  FLYOVER_TERRAIN_FALL_RESPONSE,
  FLYOVER_TERRAIN_RISE_RESPONSE,
  FLYOVER_TERRAIN_SAMPLE_INTERVAL,
  FLYOVER_FOV_DEFAULT,
  FLYOVER_LOOK_RESPONSE,
  FLYOVER_LOOK_RETURN_RESPONSE,
} from '../../map-settings/flyoverSettings'
import { MAX_CAMERA_PITCH } from '../../map-settings/terrainSettings'
import { getAnimationDuration } from '../../map-functions/mapAnimationFunctions'
import type {
  FlightCamera,
  FlightInput,
  FlightRuntime,
  FlightState,
  FlyoverPhase,
} from '../types'
import {
  blendCameras,
  blendEntryCameras,
  getEntryFlightProgress,
  getFlightCamera,
  getPoiFreeLookAngles,
  getPoiFreeLookFov,
  updateFlightCameraAnchor,
  type FlightCameraAnchor,
} from '../utils/flightCamera'
import {
  advanceFlight,
  approach,
  clamp,
  degreesToRadians,
  easeInOutCubic,
  getAltitudeSpeedMultiplier,
  getBearingDegrees,
  getDistanceMeters,
  getThrottleForSpeed,
  IDLE_FLIGHT_INPUT,
  lerp,
  moveAlongHeading,
  normalizeDegrees,
  shortestAngleDelta,
} from '../utils/flightMath'
import {
  applyEnterVisual,
  applyExitVisual,
  createFlightVisualState,
  updateFlightVisual,
} from '../utils/flightVisual'
import { preloadFlightPlane } from '../utils/preloadFlightPlane'
import { sampleGroundElevation } from '../utils/terrainSampler'
import { useFlightDrag } from './useFlightDrag'
import { useFlightInput } from './useFlightInput'

const READOUT_PUBLISH_INTERVAL = 100 // milliseconds between altitude and speed readouts

type UseFlyoverControlsOptions = {
  isStartupBlocked?: boolean
  mapRef: RefObject<MapRef | null>
  isMapReady: boolean
  isStyleLoading: boolean
  isTerrainTransitioning: boolean
  applyTerrain: (enabled: boolean) => MapLibreMap | null
  reportError: (error: unknown) => void
  takeInitialSpawn?: () => Pick<
    FlightState,
    'longitude' | 'latitude' | 'headingDegrees'
  > | null
}

// Function: Fraction of a transition completed, finishing at once for reduced motion.
function getTransitionProgress(
  now: number,
  startedAt: number,
  duration: number,
) {
  const animatedDuration = getAnimationDuration(duration)
  return animatedDuration <= 0
    ? 1
    : clamp((now - startedAt) / animatedDuration, 0, 1)
}

// Function: Read the map camera as a flight camera.
function readMapCamera(map: MapLibreMap): FlightCamera {
  const center = map.getCenter()
  return {
    center: [center.lng, center.lat],
    zoom: map.getZoom(),
    bearing: map.getBearing(),
    pitch: map.getPitch(),
    elevation: map.getCenterElevation(),
  }
}

// Function: Run flyover mode and expose its state to the map controls.
export function useFlyoverControls({
  isStartupBlocked = false,
  mapRef,
  isMapReady,
  isStyleLoading,
  isTerrainTransitioning,
  applyTerrain,
  reportError,
  takeInitialSpawn,
}: UseFlyoverControlsOptions) {
  const [phase, setPhase] = useState<FlyoverPhase>('off')
  const [isPaused, setIsPaused] = useState(false)
  const [altitudeMeters, setAltitudeMeters] = useState(
    FLYOVER_START_ALTITUDE_METERS,
  )
  const [speedMetersPerSecond, setSpeedMetersPerSecond] = useState(
    FLYOVER_DEFAULT_SPEED,
  )
  const phaseRef = useRef<FlyoverPhase>('off')
  const isPausedRef = useRef(false)
  const startupBlockedRef = useRef(isStartupBlocked)
  useEffect(() => {
    startupBlockedRef.current = isStartupBlocked
  }, [isStartupBlocked])
  const runtimeRef = useRef<FlightRuntime | null>(null)
  const cameraAnchorRef = useRef<FlightCameraAnchor | null>(null)
  const flightPositionRef = useRef<FlightState | null>(null)
  const visualRef = useRef(createFlightVisualState())
  const reportErrorRef = useRef(reportError)
  const pausedAtRef = useRef<number | null>(null)
  const pauseAfterEntryRef = useRef(false)
  const isActive = phase !== 'off'
  const viewRef = useRef({
    yaw: 0,
    pitch: 0,
    fov: FLYOVER_FOV_DEFAULT,
    freeLookProgress: 0,
  })

  useEffect(() => {
    reportErrorRef.current = reportError
  })

  // Function: Keep the phase readable by the frame loop and the interface.
  const changePhase = useCallback((next: FlyoverPhase) => {
    phaseRef.current = next
    setPhase(next)
  }, [])

  // Function: Pause or resume the plane's flight.
  const setFlyoverPaused = useCallback((shouldPause: boolean) => {
    if (phaseRef.current === 'entering') {
      pauseAfterEntryRef.current = shouldPause
      return
    }
    if (phaseRef.current !== 'flying') return

    if (isPausedRef.current === shouldPause) return

    const now = performance.now()
    if (shouldPause) {
      pausedAtRef.current = now
    } else if (pausedAtRef.current !== null) {
      const pausedDuration = now - pausedAtRef.current
      const runtime = runtimeRef.current
      if (runtime) {
        runtime.transitionStartedAt += pausedDuration
        if (runtime.travel) runtime.travel.startedAt += pausedDuration
      }
      pausedAtRef.current = null
    }

    isPausedRef.current = shouldPause
    setIsPaused(shouldPause)
  }, [])

  const togglePause = useCallback(() => {
    if (phaseRef.current !== 'flying') return

    setFlyoverPaused(!isPausedRef.current)
  }, [setFlyoverPaused])

  const resumeFromPoi = useCallback(() => {
    const runtime = runtimeRef.current
    if (!runtime || phaseRef.current !== 'flying') return

    const altitudeMultiplier = getAltitudeSpeedMultiplier(
      runtime.flight.altitudeMeters,
    )
    runtime.flight.speedMetersPerSecond = Math.min(
      runtime.flight.speedMetersPerSecond,
      FLYOVER_POI_ARRIVAL_SPEED * altitudeMultiplier,
    )
    runtime.throttle = Math.min(
      runtime.throttle,
      getThrottleForSpeed(
        runtime.flight.speedMetersPerSecond / altitudeMultiplier,
      ),
    )
    setSpeedMetersPerSecond(
      Math.round(runtime.flight.speedMetersPerSecond / 10) * 10,
    )
    setFlyoverPaused(false)
  }, [setFlyoverPaused])

  // Function: Leave flyover mode from the keyboard.
  const stopFlyoverRef = useRef<() => void>(() => {})
  const exitFromKeyboard = useCallback(() => stopFlyoverRef.current(), [])

  const inputRef = useFlightInput({
    isActive: isActive && !isStartupBlocked,
    onTogglePause: togglePause,
    onExit: exitFromKeyboard,
  })
  const {
    inputRef: pointerInputRef,
    isFreeLooking,
    enterPoiLook,
    clearPoiLook,
  } = useFlightDrag({
    isActive: phase === 'flying' && !isStartupBlocked,
    mapRef,
    viewRef,
  })

  // Function: Spawn the plane at the center of the map and begin the entry transition.
  const startFlyover = (
    pauseAfterEntry = false,
    requestedStartSpeed = FLYOVER_DEFAULT_SPEED,
    requestedStartAltitude?: number,
  ) => {
    if (
      phaseRef.current !== 'off' ||
      isStyleLoading ||
      isTerrainTransitioning
    ) {
      return
    }

    const map = applyTerrain(true)
    if (!map) return

    try {
      map.stop()
      map.setMaxPitch(MAX_CAMERA_PITCH)
      const startCamera = readMapCamera(map)
      const spawn = takeInitialSpawn?.()
      const bearing = normalizeDegrees(
        spawn?.headingDegrees ?? startCamera.bearing,
      )
      const startAltitude = clamp(
        requestedStartAltitude ??
          (spawn
            ? FLYOVER_LINK_START_ALTITUDE_METERS
            : FLYOVER_START_ALTITUDE_METERS),
        FLYOVER_MIN_ALTITUDE_METERS,
        FLYOVER_MAX_ALTITUDE_METERS,
      )
      // The camera backs up first: the plane spawns behind the view center, by
      // the distance the chase camera looks ahead, so the view lands where it was.
      const { longitude, latitude } =
        spawn ??
        moveAlongHeading(
          startCamera.center[0],
          startCamera.center[1],
          bearing + 180,
          startAltitude *
            Math.tan(degreesToRadians(FLYOVER_CAMERA_PITCH)) *
            FLYOVER_START_BACKUP_SCALE,
        )
      const ground =
        sampleGroundElevation(map, longitude, latitude) ?? startCamera.elevation

      // Flight sets the camera height itself, so the view center stops following the ground.
      map.setCenterClampedToGround(false)
      map.setCenterElevation(startCamera.elevation)

      const baseStartSpeed = clamp(
        requestedStartSpeed,
        FLYOVER_MIN_SPEED,
        FLYOVER_MAX_SPEED,
      )
      const startSpeed =
        baseStartSpeed * getAltitudeSpeedMultiplier(startAltitude)
      runtimeRef.current = {
        flight: {
          longitude,
          latitude,
          altitudeMeters: startAltitude,
          headingDegrees: bearing,
          speedMetersPerSecond: startSpeed,
        },
        cameraBearing: bearing,
        turnRate: 0,
        throttle: getThrottleForSpeed(baseStartSpeed),
        climbRate: 0,
        groundElevation: ground,
        targetGroundElevation: ground,
        lastTerrainSampleAt: performance.now(),
        travel: null,
        transitionStartedAt: performance.now(),
        startCamera,
        hasDistantStart: Boolean(
          spawn &&
          (Math.abs(startCamera.center[0] - spawn.longitude) > 0.01 ||
            Math.abs(startCamera.center[1] - spawn.latitude) > 0.01),
        ),
        exitFrom: { yawDegrees: 0, pitchDegrees: 0, rollDegrees: 0 },
        exitCameraFrom: startCamera,
        exitCameraTo: startCamera,
      }
      flightPositionRef.current = runtimeRef.current.flight
      visualRef.current = createFlightVisualState()
      setAltitudeMeters(startAltitude)
      setSpeedMetersPerSecond(Math.round(startSpeed / 10) * 10)
      pauseAfterEntryRef.current = pauseAfterEntry
      isPausedRef.current = false
      pausedAtRef.current = null
      setIsPaused(false)

      // Release focus from the toggle after a pointer press so the keys reach the flight.
      const focused = document.activeElement
      if (
        focused instanceof HTMLElement &&
        !focused.matches(':focus-visible')
      ) {
        focused.blur()
      }

      changePhase('entering')
    } catch (error) {
      map.setCenterClampedToGround(true)
      reportError(error)
    }
  }

  // Function: Begin turning the plane off screen while the camera zooms out.
  const stopFlyover = () => {
    const runtime = runtimeRef.current
    const map = mapRef.current?.getMap()
    if (phaseRef.current !== 'flying' || !runtime || !map) return

    const visual = visualRef.current
    clearPoiLook()
    runtime.exitFrom = {
      yawDegrees: visual.yawDegrees,
      pitchDegrees: visual.pitchDegrees,
      rollDegrees: visual.rollDegrees,
    }
    const from = readMapCamera(map)
    runtime.exitCameraFrom = from
    runtime.exitCameraTo = {
      ...from,
      zoom: Math.min(from.zoom, FLYOVER_EXIT_ZOOM),
      pitch: FLYOVER_EXIT_PITCH,
      elevation: map.queryTerrainElevation(from.center) ?? from.elevation,
    }
    runtime.travel = null
    runtime.transitionStartedAt = performance.now()
    isPausedRef.current = false
    setIsPaused(false)
    changePhase('exiting')
  }

  // Function: Carry the plane quickly toward a map position. It climbs along the
  // way, returns to its starting altitude, and stops where the position is at the
  // center of the view.
  const travelTo = (coordinates: [number, number]) => {
    const runtime = runtimeRef.current
    if (phaseRef.current !== 'flying' || !runtime) return

    if (isPausedRef.current) setFlyoverPaused(false)
    const { flight } = runtime
    const from: [number, number] = [flight.longitude, flight.latitude]
    const startAltitude = runtime.travel?.startAltitude ?? flight.altitudeMeters
    const distance = getDistanceMeters(from, coordinates)
    const arrivalDistance =
      startAltitude *
      Math.tan(degreesToRadians(FLYOVER_CAMERA_PITCH)) *
      FLYOVER_POI_ARRIVAL_VIEW_SCALE
    const shortOfTarget =
      distance > 0 ? Math.max(0, distance - arrivalDistance) / distance : 0

    runtime.travel = {
      from,
      to: [
        lerp(from[0], coordinates[0], shortOfTarget),
        lerp(from[1], coordinates[1], shortOfTarget),
      ],
      startedAt: performance.now(),
      fromHeading: flight.headingDegrees,
      headingChange: shortestAngleDelta(
        flight.headingDegrees,
        getBearingDegrees(from, coordinates),
      ),
      startAltitude,
      peakAltitude: clamp(
        distance * FLYOVER_POI_PEAK_ALTITUDE_RATIO,
        startAltitude,
        FLYOVER_MAX_ALTITUDE_METERS,
      ),
    }
  }

  const toggleFlyover = (
    startPaused = false,
    requestedStartSpeed = FLYOVER_DEFAULT_SPEED,
    requestedStartAltitude?: number,
  ) => {
    if (phaseRef.current === 'off') {
      startFlyover(startPaused, requestedStartSpeed, requestedStartAltitude)
    } else stopFlyover()
  }

  const pauseAtPosition = useCallback(
    (
      coordinates: [number, number, number],
      poiCoordinates: [number, number],
      poiFov?: number,
    ) => {
      const runtime = runtimeRef.current
      const map = mapRef.current?.getMap()
      if (!runtime || !map || phaseRef.current !== 'flying') return
      runtime.flight.longitude = coordinates[0]
      runtime.flight.latitude = coordinates[1]
      runtime.flight.altitudeMeters = coordinates[2] - runtime.groundElevation
      setAltitudeMeters(Math.round(runtime.flight.altitudeMeters))
      runtime.travel = null
      const terrain =
        map.queryTerrainElevation(poiCoordinates) ?? runtime.groundElevation
      const fieldOfView = getPoiFreeLookFov(poiFov)
      const { yaw, pitch } = getPoiFreeLookAngles(
        runtime,
        poiCoordinates,
        terrain,
        fieldOfView,
        cameraAnchorRef.current ?? undefined,
      )
      enterPoiLook(yaw, pitch, fieldOfView)
      setFlyoverPaused(true)
    },
    [mapRef, setFlyoverPaused, enterPoiLook],
  )

  const getFlightElevation = useCallback(() => {
    const runtime = runtimeRef.current
    return runtime
      ? runtime.groundElevation + runtime.flight.altitudeMeters
      : null
  }, [])

  useEffect(() => {
    stopFlyoverRef.current = stopFlyover
  })

  useEffect(() => {
    if (isMapReady) preloadFlightPlane()
  }, [isMapReady])

  // Pointer and keyboard map gestures would fight the flight camera. Flyover also
  // takes over the view center's height, which is handed back when it ends.
  useEffect(() => {
    if (!isActive) return

    const map = mapRef.current?.getMap()
    if (!map) return

    const handlers = [
      map.scrollZoom,
      map.boxZoom,
      map.dragRotate,
      map.dragPan,
      map.keyboard,
      map.doubleClickZoom,
      map.touchZoomRotate,
      map.touchPitch,
    ].filter((handler) => handler.isEnabled())
    handlers.forEach((handler) => handler.disable())
    const previousFov = map.getVerticalFieldOfView()
    viewRef.current = {
      yaw: 0,
      pitch: 0,
      fov: FLYOVER_FOV_DEFAULT,
      freeLookProgress: 0,
    }
    map.setVerticalFieldOfView(FLYOVER_FOV_DEFAULT)

    return () => {
      try {
        handlers.forEach((handler) => handler.enable())
        map.setCenterClampedToGround(true)
        map.setVerticalFieldOfView(previousFov)
      } catch (error) {
        console.error('Unable to restore map controls.', error)
      }
    }
  }, [isActive, mapRef])

  // The frame loop: step the flight, then move the map camera and pose the plane.
  useEffect(() => {
    if (phase === 'off') return

    const map = mapRef.current?.getMap()
    const runtime = runtimeRef.current
    if (!map || !runtime) return

    const visual = visualRef.current
    const cameraAnchor = {
      longitude: runtime.flight.longitude,
      latitude: runtime.flight.latitude,
      altitudeMeters: runtime.flight.altitudeMeters,
      groundElevation: runtime.groundElevation,
    }
    cameraAnchorRef.current = cameraAnchor
    let frameId = 0
    let lastTime = performance.now()
    let lastReadoutPublish = 0
    let stabilization = 0
    const flightInput: FlightInput = { turn: 0, climb: 0, throttle: 0 }

    // Function: Stop flying after an error so the map is not left locked.
    const abortFlight = (error: unknown) => {
      window.cancelAnimationFrame(frameId)
      visual.isVisible = false
      reportErrorRef.current(error)
      changePhase('off')
    }

    // Function: Ease the ground level toward the terrain sampled around the plane.
    const updateGround = (now: number, seconds: number) => {
      if (
        now - runtime.lastTerrainSampleAt >=
        FLYOVER_TERRAIN_SAMPLE_INTERVAL
      ) {
        runtime.lastTerrainSampleAt = now
        const ground = sampleGroundElevation(
          map,
          runtime.flight.longitude,
          runtime.flight.latitude,
        )
        if (ground !== null) runtime.targetGroundElevation = ground
      }

      runtime.groundElevation = approach(
        runtime.groundElevation,
        runtime.targetGroundElevation,
        runtime.targetGroundElevation > runtime.groundElevation
          ? FLYOVER_TERRAIN_RISE_RESPONSE
          : FLYOVER_TERRAIN_FALL_RESPONSE,
        seconds,
      )
    }

    // Function: Place the plane along its trip toward a marker, climbing and then
    // returning to its starting altitude and easing down to the arrival speed.
    const advanceTravel = (
      now: number,
      seconds: number,
      previousAltitude: number,
    ) => {
      const { travel, flight } = runtime
      if (!travel) return

      const progress = getTransitionProgress(
        now,
        travel.startedAt,
        FLYOVER_POI_TRAVEL_DURATION,
      )
      const eased = easeInOutCubic(progress)
      flight.longitude = lerp(travel.from[0], travel.to[0], eased)
      flight.latitude = lerp(travel.from[1], travel.to[1], eased)
      flight.headingDegrees = normalizeDegrees(
        travel.fromHeading + travel.headingChange * eased,
      )
      flight.altitudeMeters = lerp(
        travel.startAltitude,
        travel.peakAltitude,
        Math.sin(Math.PI * progress),
      )
      runtime.climbRate =
        seconds > 0 ? (flight.altitudeMeters - previousAltitude) / seconds : 0
      if (progress >= 1) {
        runtime.travel = null
        runtime.throttle = Math.min(
          runtime.throttle,
          getThrottleForSpeed(FLYOVER_POI_ARRIVAL_SPEED),
        )
        runtime.climbRate = 0
      }
    }

    const tick = (now: number) => {
      frameId = window.requestAnimationFrame(tick)
      const seconds = clamp(
        (now - lastTime) / 1000,
        0,
        FLYOVER_MAX_FRAME_SECONDS,
      )
      lastTime = now

      try {
        const viewportHeight = map.getCanvas().clientHeight
        const fov = map.getVerticalFieldOfView()

        if (phase === 'entering') {
          const progress = getTransitionProgress(
            now,
            runtime.transitionStartedAt,
            FLYOVER_ENTER_DURATION +
              (runtime.hasDistantStart
                ? FLYOVER_BASE_MAP_RELOCATION_DURATION
                : 0),
          )
          const flightProgress = getEntryFlightProgress(
            progress,
            runtime.hasDistantStart,
          )
          if (
            !startupBlockedRef.current &&
            (!runtime.hasDistantStart || flightProgress > 0)
          )
            advanceFlight(runtime, IDLE_FLIGHT_INPUT, seconds)
          updateGround(now, seconds)
          map.jumpTo(
            blendEntryCameras(
              runtime.startCamera,
              getFlightCamera(runtime, viewportHeight, fov),
              progress,
              runtime.hasDistantStart,
            ),
          )
          updateFlightVisual(visual, runtime)
          applyEnterVisual(visual, flightProgress)
          visual.isVisible = !runtime.hasDistantStart || flightProgress > 0
          if (progress >= 1) {
            changePhase('flying')
            if (pauseAfterEntryRef.current) {
              pauseAfterEntryRef.current = false
              pausedAtRef.current = now
              isPausedRef.current = true
              setIsPaused(true)
            }
          }
        } else if (phase === 'flying') {
          if (startupBlockedRef.current) {
            const previousGround = runtime.groundElevation
            updateGround(now, seconds)
            // The hidden opening view can settle immediately without an animated climb.
            runtime.groundElevation = runtime.targetGroundElevation
            if (Math.abs(runtime.groundElevation - previousGround) > 0.01)
              map.jumpTo(getFlightCamera(runtime, viewportHeight, fov))
            return
          }
          const keys = inputRef.current
          const previousAltitude = runtime.flight.altitudeMeters
          const previousBearing = runtime.cameraBearing
          // Steering comes from the keys and the map drag together; a trip takes all control.
          flightInput.turn = runtime.travel
            ? 0
            : clamp(keys.turn + pointerInputRef.current.turn, -1, 1)
          flightInput.climb = runtime.travel
            ? 0
            : clamp(keys.climb + pointerInputRef.current.climb, -1, 1)
          flightInput.throttle = runtime.travel ? 0 : keys.throttle
          if (!isPausedRef.current) {
            advanceFlight(runtime, flightInput, seconds)
            advanceTravel(now, seconds, previousAltitude)
            updateGround(now, seconds)
          }
          const pointer = pointerInputRef.current
          const view = viewRef.current
          const isStabilized =
            (pointer.isLooking || pointer.isPoiLooking) &&
            pointer.fov < FLYOVER_FOV_DEFAULT
          if (isStabilized) {
            const turn = shortestAngleDelta(
              previousBearing,
              runtime.cameraBearing,
            )
            // Cancel aircraft rotation before easing mouse input, keeping world bearing fixed.
            pointer.yaw -= turn
            view.yaw -= turn
          }
          const reducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)',
          ).matches
          const response = reducedMotion
            ? 1
            : 1 - Math.exp(-FLYOVER_LOOK_RESPONSE * seconds)
          const isLooking = pointer.isLooking || pointer.isPoiLooking
          const lookResponse =
            reducedMotion || isLooking
              ? response
              : 1 - Math.exp(-FLYOVER_LOOK_RETURN_RESPONSE * seconds)
          view.yaw += shortestAngleDelta(view.yaw, pointer.yaw) * lookResponse
          view.pitch = lerp(view.pitch, pointer.pitch, lookResponse)
          view.fov = lerp(view.fov, pointer.fov, response)
          view.freeLookProgress = lerp(
            view.freeLookProgress,
            isLooking ? 1 : 0,
            lookResponse,
          )
          stabilization = lerp(stabilization, isStabilized ? 1 : 0, response)
          updateFlightCameraAnchor(
            cameraAnchor,
            runtime,
            stabilization,
            seconds,
            reducedMotion,
          )
          map.setVerticalFieldOfView(view.fov)
          map.jumpTo(
            getFlightCamera(
              runtime,
              viewportHeight,
              view.fov,
              view.yaw,
              view.pitch,
              view.freeLookProgress,
              cameraAnchor,
            ),
          )
          updateFlightVisual(visual, runtime)
          visual.lookYaw = view.yaw
          visual.lookPitch = view.pitch
          visual.fieldOfView = view.fov
          visual.freeLookProgress = view.freeLookProgress
          visual.poiFocusProgress = lerp(
            visual.poiFocusProgress,
            pointer.isPoiLooking ? 1 : 0,
            response,
          )

          if (now - lastReadoutPublish >= READOUT_PUBLISH_INTERVAL) {
            lastReadoutPublish = now
            setAltitudeMeters(
              Math.round(runtime.flight.altitudeMeters / 10) * 10,
            )
            setSpeedMetersPerSecond(
              Math.round(runtime.flight.speedMetersPerSecond / 10) * 10,
            )
          }
        } else {
          const planeProgress = getTransitionProgress(
            now,
            runtime.transitionStartedAt,
            FLYOVER_EXIT_DURATION,
          )
          const cameraProgress = getTransitionProgress(
            now,
            runtime.transitionStartedAt,
            FLYOVER_EXIT_CAMERA_DURATION,
          )
          applyExitVisual(visual, runtime.exitFrom, planeProgress)
          map.jumpTo(
            blendCameras(
              runtime.exitCameraFrom,
              runtime.exitCameraTo,
              easeInOutCubic(cameraProgress),
            ),
          )
          if (planeProgress >= 1) visual.isVisible = false
          if (planeProgress >= 1 && cameraProgress >= 1) {
            window.cancelAnimationFrame(frameId)
            changePhase('off')
          }
        }
      } catch (error) {
        abortFlight(error)
      }
    }
    frameId = window.requestAnimationFrame(tick)

    return () => window.cancelAnimationFrame(frameId)
  }, [phase, mapRef, inputRef, pointerInputRef, changePhase])

  return {
    flyoverPhase: phase,
    isFlyoverEnabled: isActive,
    isFlyoverTransitioning: phase === 'entering' || phase === 'exiting',
    isFlyoverPaused: isPaused,
    isFreeLooking,
    clearPoiFocus: clearPoiLook,
    setFlyoverPaused,
    flyoverAltitudeMeters: altitudeMeters,
    flyoverSpeedMetersPerSecond: speedMetersPerSecond,
    flightVisualRef: visualRef,
    toggleFlyover,
    flightPositionRef,
    getFlightElevation,
    pauseAtPosition,
    resumeFromPoi,
    travelTo,
  }
}
