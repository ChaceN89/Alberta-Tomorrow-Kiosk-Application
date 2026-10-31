/**
  File: types.ts | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Define flight state, input, camera, and plane display types for flyover mode.

  Usage:
  - Imported by the flyover hooks, utilities, and components.

  Notes:
  - Angles are degrees; heading 0 is north and increases clockwise.
 */
export type FlyoverPhase = 'off' | 'entering' | 'flying' | 'exiting'

export type FlightState = {
  longitude: number
  latitude: number
  altitudeMeters: number
  headingDegrees: number
  speedMetersPerSecond: number
}

// Steering is -1 (left), 0, or 1 (right); climb is -1 (descend), 0, or 1 (climb);
// throttle is -1 (slow down), 0, or 1 (speed up).
export type FlightInput = {
  turn: number
  climb: number
  throttle: number
}

// Elevation is the height of the view center above sea level, in meters.
export type FlightCamera = {
  center: [number, number]
  zoom: number
  bearing: number
  pitch: number
  elevation: number
}

// Plane pose the overlay reads each frame. Offsets are fractions of half the
// screen height (y) or width (x) away from the plane's resting position.
export type FlightVisualState = {
  isVisible: boolean
  yawDegrees: number
  pitchDegrees: number
  rollDegrees: number
  offsetX: number
  offsetY: number
  scale: number
}

export type FlightPoseAngles = {
  yawDegrees: number
  pitchDegrees: number
  rollDegrees: number
}

// A quick trip toward a map marker, starting from where the plane was selected.
export type FlightTravel = {
  from: [number, number]
  to: [number, number]
  startedAt: number
  fromHeading: number
  headingChange: number
  startAltitude: number
  peakAltitude: number
}

// Mutable flight data for the frame loop. It changes every frame, so it lives in
// a ref instead of React state.
export type FlightRuntime = {
  flight: FlightState
  cameraBearing: number
  turnRate: number
  throttle: number
  climbRate: number
  groundElevation: number
  targetGroundElevation: number
  lastTerrainSampleAt: number
  travel: FlightTravel | null
  transitionStartedAt: number
  startCamera: FlightCamera
  exitFrom: FlightPoseAngles
  exitCameraFrom: FlightCamera
  exitCameraTo: FlightCamera
}
