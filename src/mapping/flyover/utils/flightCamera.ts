/**
  File: flightCamera.ts | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Convert the plane's flight state into the map camera that chases it.

  Usage:
  - Imported by useFlyoverControls to position the map each frame.

  Notes:
  - Altitude sets the camera distance above the view center. The view center
    sits at the smoothed ground elevation instead of following every bump.
  - Zoomed freelook smooths a camera-only anchor without changing flight physics.
 */
import { ZOOM_MAX, ZOOM_MIN } from '../../map-settings/mapSettings'
import { Euler, Vector3 } from 'three'
import {
  FLYOVER_CAMERA_PITCH,
  FLYOVER_ENTER_DURATION,
  FLYOVER_BASE_MAP_RELOCATION_DURATION,
  FLYOVER_FOV_DEFAULT,
  FLYOVER_FOV_ZOOM_IN,
  FLYOVER_FOV_ZOOM_OUT,
  FLYOVER_FOV_POI_FREE_LOOK,
  FLYOVER_PLANE_VIEW,
  FLYOVER_STABILIZED_FOLLOW_RESPONSE,
} from '../../map-settings/flyoverSettings'
import type { FlightCamera, FlightRuntime } from '../types'
import {
  clamp,
  degreesToRadians,
  easeInOutCubic,
  getBearingDegrees,
  getDistanceMeters,
  lerp,
  moveAlongHeading,
  shortestAngleDelta,
} from './flightMath'

const EARTH_CIRCUMFERENCE_METERS = 2 * Math.PI * 6371008.8
const MAP_TILE_SIZE = 512

export type FlightCameraAnchor = {
  longitude: number
  latitude: number
  altitudeMeters: number
  groundElevation: number
}

export function updateFlightCameraAnchor(
  anchor: FlightCameraAnchor,
  runtime: FlightRuntime,
  strength: number,
  seconds: number,
  reducedMotion: boolean,
) {
  const response = reducedMotion
    ? 1
    : lerp(
        1,
        1 - Math.exp(-FLYOVER_STABILIZED_FOLLOW_RESPONSE * seconds),
        strength,
      )
  anchor.longitude +=
    shortestAngleDelta(anchor.longitude, runtime.flight.longitude) * response
  anchor.latitude = lerp(anchor.latitude, runtime.flight.latitude, response)
  anchor.altitudeMeters = lerp(
    anchor.altitudeMeters,
    runtime.flight.altitudeMeters,
    response,
  )
  anchor.groundElevation = lerp(
    anchor.groundElevation,
    runtime.groundElevation,
    response,
  )
}
export const FLIGHT_ORBIT_CAMERA_PITCH =
  (Math.atan2(
    FLYOVER_PLANE_VIEW.cameraPosition[2],
    FLYOVER_PLANE_VIEW.cameraPosition[1],
  ) *
    180) /
  Math.PI

// Both renderers orbit the aircraft's origin and cross it along the same radius.
export function getFlightOrbitCamera(
  yaw: number,
  pitch: number,
  fieldOfView: number,
) {
  const position = new Vector3(...FLYOVER_PLANE_VIEW.cameraPosition)
  const radius = position.length()
  const zoom = clamp(
    (FLYOVER_FOV_DEFAULT - fieldOfView) /
      (FLYOVER_FOV_DEFAULT - FLYOVER_FOV_ZOOM_IN),
    0,
    1,
  )
  const easedZoom = zoom * zoom * (3 - 2 * zoom)
  const distance = radius - easedZoom * (radius + 2)
  position
    .multiplyScalar(distance / radius)
    .applyEuler(
      new Euler(degreesToRadians(pitch), -degreesToRadians(yaw), 0, 'YXZ'),
    )
  return { position, distance }
}

// Function: Find the map zoom that places the camera at an altitude above the view center.
export function getZoomForAltitude(
  altitudeMeters: number,
  latitude: number,
  pitchDegrees: number,
  viewportHeight: number,
  verticalFovDegrees: number,
) {
  const cameraDistance =
    (0.5 / Math.tan(degreesToRadians(verticalFovDegrees) / 2)) * viewportHeight
  const cameraHeight = cameraDistance * Math.cos(degreesToRadians(pitchDegrees))
  const metersPerPixelAtZoomZero =
    (EARTH_CIRCUMFERENCE_METERS * Math.cos(degreesToRadians(latitude))) /
    MAP_TILE_SIZE

  return Math.log2((cameraHeight * metersPerPixelAtZoomZero) / altitudeMeters)
}

export function getEntryFlightProgress(
  progress: number,
  hasDistantStart: boolean,
) {
  if (!hasDistantStart) return progress
  const relocationShare =
    FLYOVER_BASE_MAP_RELOCATION_DURATION /
    (FLYOVER_BASE_MAP_RELOCATION_DURATION + FLYOVER_ENTER_DURATION)
  return clamp((progress - relocationShare) / (1 - relocationShare), 0, 1)
}

// Relocate first, then use the normal zoom and aircraft-entry timing.
export function blendEntryCameras(
  from: FlightCamera,
  to: FlightCamera,
  progress: number,
  hasDistantStart: boolean,
): FlightCamera {
  if (!hasDistantStart) return blendCameras(from, to, easeInOutCubic(progress))
  const camera = blendCameras(
    from,
    to,
    easeInOutCubic(getEntryFlightProgress(progress, true)),
  )
  const relocationShare =
    FLYOVER_BASE_MAP_RELOCATION_DURATION /
    (FLYOVER_BASE_MAP_RELOCATION_DURATION + FLYOVER_ENTER_DURATION)
  const travel =
    relocationShare <= 0
      ? 1
      : easeInOutCubic(clamp(progress / relocationShare, 0, 1))
  camera.center = [
    lerp(from.center[0], to.center[0], travel),
    lerp(from.center[1], to.center[1], travel),
  ]
  return camera
}

function getFlightCameraPosition(
  runtime: FlightRuntime,
  verticalFovDegrees: number,
  lookYaw: number,
  lookPitch: number,
  anchor: Pick<
    FlightCameraAnchor,
    'longitude' | 'latitude' | 'altitudeMeters'
  > = runtime.flight,
) {
  const { cameraBearing } = runtime
  const orbit = getFlightOrbitCamera(lookYaw, lookPitch, verticalFovDegrees)
  // Match the model-space orbit at a small scale relative to flight altitude.
  const scale = anchor.altitudeMeters * 0.01
  const east = orbit.position.x * scale
  const north =
    (FLYOVER_PLANE_VIEW.cameraPosition[2] - orbit.position.z) * scale
  const cameraPosition = moveAlongHeading(
    anchor.longitude,
    anchor.latitude,
    cameraBearing + (Math.atan2(east, north) * 180) / Math.PI,
    Math.hypot(east, north),
  )
  const altitude = Math.max(
    1,
    anchor.altitudeMeters +
      (orbit.position.y - FLYOVER_PLANE_VIEW.cameraPosition[1]) * scale,
  )
  return { ...cameraPosition, altitude }
}

export function getPoiFreeLookAngles(
  runtime: FlightRuntime,
  coordinates: [number, number],
  terrainElevation: number,
  fieldOfView: number,
  anchor?: FlightCameraAnchor,
) {
  let yaw = 0
  let pitch = 0
  // Re-aim from the zoomed orbit position, not from the aircraft's center.
  for (let iteration = 0; iteration < 4; iteration++) {
    const camera = getFlightCameraPosition(
      runtime,
      fieldOfView,
      yaw,
      pitch,
      anchor,
    )
    const from: [number, number] = [camera.longitude, camera.latitude]
    yaw = shortestAngleDelta(
      runtime.cameraBearing,
      getBearingDegrees(from, coordinates),
    )
    const height =
      (anchor?.groundElevation ?? runtime.groundElevation) +
      camera.altitude -
      terrainElevation
    pitch =
      clamp(
        (Math.atan2(getDistanceMeters(from, coordinates), Math.max(1, height)) *
          180) /
          Math.PI,
        5,
        89,
      ) - FLIGHT_ORBIT_CAMERA_PITCH
  }
  return { yaw, pitch }
}

export function getPoiFreeLookFov(fieldOfView = FLYOVER_FOV_POI_FREE_LOOK) {
  if (!Number.isFinite(fieldOfView) || fieldOfView <= 0) {
    throw new Error('POI flyoverPoiFov must be a positive, finite angle.')
  }
  return clamp(fieldOfView, FLYOVER_FOV_ZOOM_IN, FLYOVER_FOV_ZOOM_OUT)
}

// Function: Build the chase camera for the plane's current position and altitude.
export function getFlightCamera(
  runtime: FlightRuntime,
  viewportHeight: number,
  verticalFovDegrees: number,
  lookYaw = 0,
  lookPitch = 0,
  freeLookProgress = 0,
  anchor?: FlightCameraAnchor,
): FlightCamera {
  const { flight, cameraBearing } = runtime
  const pitch = clamp(
    lerp(FLYOVER_CAMERA_PITCH, FLIGHT_ORBIT_CAMERA_PITCH, freeLookProgress) +
      lookPitch,
    5,
    89,
  )
  const bearing = cameraBearing + lookYaw
  const cameraPosition = getFlightCameraPosition(
    runtime,
    verticalFovDegrees,
    lookYaw,
    lookPitch,
    anchor,
  )
  const { altitude } = cameraPosition
  const lookAheadMeters = altitude * Math.tan(degreesToRadians(pitch))
  const center = moveAlongHeading(
    cameraPosition.longitude,
    cameraPosition.latitude,
    bearing,
    lookAheadMeters,
  )

  return {
    center: [center.longitude, center.latitude],
    zoom: clamp(
      getZoomForAltitude(
        altitude,
        anchor?.latitude ?? flight.latitude,
        pitch,
        viewportHeight,
        verticalFovDegrees,
      ),
      ZOOM_MIN,
      ZOOM_MAX,
    ),
    bearing,
    pitch,
    elevation: anchor?.groundElevation ?? runtime.groundElevation,
  }
}

// Function: Blend between two cameras, turning the bearing the short way around.
export function blendCameras(
  from: FlightCamera,
  to: FlightCamera,
  amount: number,
): FlightCamera {
  return {
    center: [
      lerp(from.center[0], to.center[0], amount),
      lerp(from.center[1], to.center[1], amount),
    ],
    zoom: lerp(from.zoom, to.zoom, amount),
    bearing:
      from.bearing + shortestAngleDelta(from.bearing, to.bearing) * amount,
    pitch: lerp(from.pitch, to.pitch, amount),
    elevation: lerp(from.elevation, to.elevation, amount),
  }
}
