/**
  File: flightVisual.ts | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Work out how the plane looks on screen while flying and during transitions.

  Usage:
  - Imported by useFlyoverControls; FlightPlaneOverlay reads the result.

  Notes:
  - Steering banks the plane, climbing raises its nose, and the plane turns
    slightly ahead of the camera because the camera lags behind its heading.
 */
import {
  FLYOVER_PLANE_ENTER_OFFSET,
  FLYOVER_PLANE_ENTER_PITCH,
  FLYOVER_PLANE_EXIT_OFFSET_X,
  FLYOVER_PLANE_EXIT_OFFSET_Y,
  FLYOVER_PLANE_EXIT_ROLL,
  FLYOVER_PLANE_EXIT_SCALE,
  FLYOVER_PLANE_EXIT_YAW,
  FLYOVER_PLANE_MAX_BANK,
  FLYOVER_PLANE_MAX_PITCH,
  FLYOVER_TURN_RATE,
} from '../../map-settings/flyoverSettings'
import type {
  FlightPoseAngles,
  FlightRuntime,
  FlightVisualState,
} from '../types'
import {
  clamp,
  easeInOutCubic,
  easeOutCubic,
  getMaxClimbRate,
  lerp,
  shortestAngleDelta,
} from './flightMath'

export function createFlightVisualState(): FlightVisualState {
  return {
    isVisible: false,
    yawDegrees: 0,
    pitchDegrees: 0,
    rollDegrees: 0,
    offsetX: 0,
    offsetY: FLYOVER_PLANE_ENTER_OFFSET,
    scale: 1,
  }
}

// Function: Pose the plane from steering and climbing while it is flying.
export function updateFlightVisual(
  visual: FlightVisualState,
  runtime: FlightRuntime,
) {
  visual.isVisible = true
  visual.offsetX = 0
  visual.offsetY = 0
  visual.scale = 1
  visual.yawDegrees = shortestAngleDelta(
    runtime.cameraBearing,
    runtime.flight.headingDegrees,
  )
  visual.rollDegrees =
    clamp(runtime.turnRate / FLYOVER_TURN_RATE, -1, 1) * FLYOVER_PLANE_MAX_BANK
  visual.pitchDegrees =
    clamp(
      runtime.climbRate / getMaxClimbRate(runtime.flight.altitudeMeters),
      -1,
      1,
    ) * FLYOVER_PLANE_MAX_PITCH
}

// Function: Rise the plane in from below the screen, nose up, as it catches the camera.
export function applyEnterVisual(visual: FlightVisualState, progress: number) {
  const remaining = 1 - easeOutCubic(progress)
  visual.offsetY = remaining * FLYOVER_PLANE_ENTER_OFFSET
  visual.pitchDegrees += remaining * FLYOVER_PLANE_ENTER_PITCH
}

// Function: Bank the plane left and fly it off the left edge of the screen.
export function applyExitVisual(
  visual: FlightVisualState,
  from: FlightPoseAngles,
  progress: number,
) {
  const eased = easeInOutCubic(progress)
  visual.yawDegrees = lerp(from.yawDegrees, FLYOVER_PLANE_EXIT_YAW, eased)
  visual.rollDegrees = lerp(from.rollDegrees, FLYOVER_PLANE_EXIT_ROLL, eased)
  visual.pitchDegrees = lerp(from.pitchDegrees, 0, eased)
  visual.offsetX = FLYOVER_PLANE_EXIT_OFFSET_X * eased * eased
  visual.offsetY = FLYOVER_PLANE_EXIT_OFFSET_Y * eased
  visual.scale = lerp(1, FLYOVER_PLANE_EXIT_SCALE, eased)
}
