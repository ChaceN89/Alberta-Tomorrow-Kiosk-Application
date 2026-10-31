/**
  File: flightCamera.ts | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Convert the plane's flight state into the map camera that chases it.

  Usage:
  - Imported by useFlyoverControls to position the map each frame.

  Notes:
  - Altitude sets the camera distance above the view center. The view center
    sits at the smoothed ground elevation instead of following every bump.
 */
import { ZOOM_MAX, ZOOM_MIN } from '../../map-settings/mapSettings'
import { FLYOVER_CAMERA_PITCH } from '../../map-settings/flyoverSettings'
import type { FlightCamera, FlightRuntime } from '../types'
import {
  clamp,
  degreesToRadians,
  lerp,
  moveAlongHeading,
  shortestAngleDelta,
} from './flightMath'

const EARTH_CIRCUMFERENCE_METERS = 2 * Math.PI * 6371008.8
const MAP_TILE_SIZE = 512

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

// Function: Build the chase camera for the plane's current position and altitude.
export function getFlightCamera(
  runtime: FlightRuntime,
  viewportHeight: number,
  verticalFovDegrees: number,
): FlightCamera {
  const { flight, cameraBearing } = runtime
  const lookAheadMeters =
    flight.altitudeMeters * Math.tan(degreesToRadians(FLYOVER_CAMERA_PITCH))
  const center = moveAlongHeading(
    flight.longitude,
    flight.latitude,
    cameraBearing,
    lookAheadMeters,
  )

  return {
    center: [center.longitude, center.latitude],
    zoom: clamp(
      getZoomForAltitude(
        flight.altitudeMeters,
        flight.latitude,
        FLYOVER_CAMERA_PITCH,
        viewportHeight,
        verticalFovDegrees,
      ),
      ZOOM_MIN,
      ZOOM_MAX,
    ),
    bearing: cameraBearing,
    pitch: FLYOVER_CAMERA_PITCH,
    elevation: runtime.groundElevation,
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
