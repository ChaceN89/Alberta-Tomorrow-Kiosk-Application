/**
  File: flightMath.ts | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Provide the math that moves the plane: angles, easing, position, and steering.

  Usage:
  - Imported by useFlyoverControls and the other flyover utilities.

  Notes:
  - Positions use a flat-earth approximation that is accurate over flight distances.
 */
import {
  FLYOVER_ALTITUDE_CHANGE_RATE,
  FLYOVER_ALTITUDE_CHANGE_SCALE,
  FLYOVER_ALTITUDE_SPEED_MULTIPLIER,
  FLYOVER_BRAKE_RESPONSE,
  FLYOVER_CAMERA_BEARING_RESPONSE,
  FLYOVER_MAX_ALTITUDE_METERS,
  FLYOVER_MAX_SPEED,
  FLYOVER_MIN_ALTITUDE_METERS,
  FLYOVER_MIN_SPEED,
  FLYOVER_SPEED_RESPONSE,
  FLYOVER_THROTTLE_CHANGE_RATE,
  FLYOVER_TURN_RATE,
  FLYOVER_TURN_RESPONSE,
} from '../../map-settings/flyoverSettings'
import type { FlightInput, FlightRuntime } from '../types'

const EARTH_RADIUS_METERS = 6371008.8
const MAX_LATITUDE = 85
const CLIMB_RATE_RESPONSE = 4

export const IDLE_FLIGHT_INPUT: FlightInput = {
  turn: 0,
  climb: 0,
  throttle: 0,
}

export const degreesToRadians = (degrees: number) => (degrees * Math.PI) / 180

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

export const lerp = (from: number, to: number, amount: number) =>
  from + (to - from) * amount

export const easeOutCubic = (t: number) => 1 - (1 - t) ** 3

export const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2

export const normalizeDegrees = (degrees: number) =>
  ((degrees % 360) + 360) % 360

// Function: Signed angle from one heading to another, from -180 to 180 degrees.
export const shortestAngleDelta = (from: number, to: number) =>
  normalizeDegrees(to - from + 180) - 180

// Function: Ease a value toward its target at a rate that ignores frame length.
export const approach = (
  current: number,
  target: number,
  response: number,
  seconds: number,
) => current + (target - current) * (1 - Math.exp(-response * seconds))

// Function: Move a position along a heading by a distance in meters.
export function moveAlongHeading(
  longitude: number,
  latitude: number,
  headingDegrees: number,
  distanceMeters: number,
) {
  const heading = degreesToRadians(headingDegrees)
  const latitudeRadians = degreesToRadians(latitude)
  const northMeters = Math.cos(heading) * distanceMeters
  const eastMeters = Math.sin(heading) * distanceMeters
  const nextLatitude =
    latitude + (northMeters / EARTH_RADIUS_METERS) * (180 / Math.PI)
  const nextLongitude =
    longitude +
    (eastMeters / (EARTH_RADIUS_METERS * Math.cos(latitudeRadians))) *
      (180 / Math.PI)

  return {
    longitude: ((((nextLongitude + 180) % 360) + 360) % 360) - 180,
    latitude: clamp(nextLatitude, -MAX_LATITUDE, MAX_LATITUDE),
  }
}

// Function: Bearing in degrees from one position to another.
export function getBearingDegrees(
  from: [number, number],
  to: [number, number],
) {
  const middleLatitude = degreesToRadians((from[1] + to[1]) / 2)
  const east = (to[0] - from[0]) * Math.cos(middleLatitude)
  const north = to[1] - from[1]
  return normalizeDegrees((Math.atan2(east, north) * 180) / Math.PI)
}

// Function: Approximate distance in meters between two positions.
export function getDistanceMeters(
  from: [number, number],
  to: [number, number],
) {
  const middleLatitude = degreesToRadians((from[1] + to[1]) / 2)
  const east = degreesToRadians(to[0] - from[0]) * Math.cos(middleLatitude)
  const north = degreesToRadians(to[1] - from[1])
  return Math.hypot(east, north) * EARTH_RADIUS_METERS
}

// Function: Fastest climb or descent at an altitude, in meters per second.
export const getMaxClimbRate = (altitudeMeters: number) =>
  Math.max(
    FLYOVER_ALTITUDE_CHANGE_RATE,
    altitudeMeters * FLYOVER_ALTITUDE_CHANGE_SCALE,
  )

// Function: Base speed at a throttle from 0 (slowest) to 1 (fastest), spaced evenly in ratio.
export const getBaseSpeed = (throttle: number) =>
  FLYOVER_MIN_SPEED * (FLYOVER_MAX_SPEED / FLYOVER_MIN_SPEED) ** throttle

// Function: Throttle that gives a base speed.
export const getThrottleForSpeed = (speedMetersPerSecond: number) =>
  clamp(
    Math.log(speedMetersPerSecond / FLYOVER_MIN_SPEED) /
      Math.log(FLYOVER_MAX_SPEED / FLYOVER_MIN_SPEED),
    0,
    1,
  )

// Function: Speed multiplier for an altitude: 1 at the minimum, rising to the setting at the maximum.
export const getAltitudeSpeedMultiplier = (altitudeMeters: number) =>
  FLYOVER_ALTITUDE_SPEED_MULTIPLIER **
  clamp(
    Math.log(altitudeMeters / FLYOVER_MIN_ALTITUDE_METERS) /
      Math.log(FLYOVER_MAX_ALTITUDE_METERS / FLYOVER_MIN_ALTITUDE_METERS),
    0,
    1,
  )

// Function: Step the flight forward by one frame of steering, speed, and altitude.
export function advanceFlight(
  runtime: FlightRuntime,
  input: FlightInput,
  seconds: number,
) {
  const { flight } = runtime

  runtime.turnRate = approach(
    runtime.turnRate,
    input.turn * FLYOVER_TURN_RATE,
    FLYOVER_TURN_RESPONSE,
    seconds,
  )
  flight.headingDegrees = normalizeDegrees(
    flight.headingDegrees + runtime.turnRate * seconds,
  )
  runtime.cameraBearing = normalizeDegrees(
    runtime.cameraBearing +
      shortestAngleDelta(runtime.cameraBearing, flight.headingDegrees) *
        (1 - Math.exp(-FLYOVER_CAMERA_BEARING_RESPONSE * seconds)),
  )

  runtime.throttle = clamp(
    runtime.throttle + input.throttle * FLYOVER_THROTTLE_CHANGE_RATE * seconds,
    0,
    1,
  )
  const targetSpeed =
    getBaseSpeed(runtime.throttle) *
    getAltitudeSpeedMultiplier(flight.altitudeMeters)
  flight.speedMetersPerSecond = approach(
    flight.speedMetersPerSecond,
    targetSpeed,
    targetSpeed < flight.speedMetersPerSecond
      ? FLYOVER_BRAKE_RESPONSE
      : FLYOVER_SPEED_RESPONSE,
    seconds,
  )

  runtime.climbRate = approach(
    runtime.climbRate,
    input.climb * getMaxClimbRate(flight.altitudeMeters),
    CLIMB_RATE_RESPONSE,
    seconds,
  )
  const nextAltitude = flight.altitudeMeters + runtime.climbRate * seconds
  flight.altitudeMeters = clamp(
    nextAltitude,
    FLYOVER_MIN_ALTITUDE_METERS,
    FLYOVER_MAX_ALTITUDE_METERS,
  )
  if (flight.altitudeMeters !== nextAltitude) runtime.climbRate = 0

  const moved = moveAlongHeading(
    flight.longitude,
    flight.latitude,
    flight.headingDegrees,
    flight.speedMetersPerSecond * seconds,
  )
  flight.longitude = moved.longitude
  flight.latitude = moved.latitude
}
