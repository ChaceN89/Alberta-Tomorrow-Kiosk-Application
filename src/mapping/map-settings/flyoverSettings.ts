/**
  File: flyoverSettings.ts | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Define flyover flight, camera, transition, and plane display settings.

  Usage:
  - Imported by the flyover hooks, utilities, and components in mapping/flyover.

  Notes:
  - Altitudes are meters above the terrain, speeds are meters per second, and
    angles are degrees. Change the values here to tune the flight.
 */

// Altitude above the terrain. Hold S to climb and W to descend between these limits.
export const FLYOVER_MIN_ALTITUDE_METERS = 150
export const FLYOVER_MAX_ALTITUDE_METERS = 50000
export const FLYOVER_START_ALTITUDE_METERS = 12000

// The plane spawns this far behind the view center, as a share of how far ahead
// the camera looks. At 1 what you were looking at ends up ahead of the plane;
// 0 spawns the plane right at the view center.
export const FLYOVER_START_BACKUP_SCALE = 1

// Climb and descent speed: the larger of a fixed rate and a share of the current
// altitude each second, so high altitudes change as quickly as low ones.
export const FLYOVER_ALTITUDE_CHANGE_RATE = 220 // meters per second
export const FLYOVER_ALTITUDE_CHANGE_SCALE = 0.5 // fraction of altitude per second

// Forward speed. Hold Up or Down to move a throttle between the slowest and
// fastest base speeds; it starts at the default speed.
export const FLYOVER_MIN_SPEED = 100
export const FLYOVER_DEFAULT_SPEED = 1400
export const FLYOVER_MAX_SPEED = 4200
export const FLYOVER_THROTTLE_CHANGE_RATE = 0.6 // share of the throttle range per second
export const FLYOVER_SPEED_RESPONSE = 1.5 // higher values speed up sooner
export const FLYOVER_BRAKE_RESPONSE = 3 // higher values slow down sooner

// The base speed is multiplied by this much at the maximum altitude, easing from
// 1 (the base speed) at the minimum altitude, so higher flight is faster.
export const FLYOVER_ALTITUDE_SPEED_MULTIPLIER = 25

// Steering with A and D, or by dragging the map sideways.
export const FLYOVER_TURN_RATE = 60 // degrees per second at full steering
export const FLYOVER_TURN_RESPONSE = 4 // higher values start and stop turns faster
export const FLYOVER_DRAG_STEER_DISTANCE = 140 // pixels dragged for full steering
export const FLYOVER_DRAG_DEAD_ZONE = 6 // pixels before a drag starts steering

// The chase camera that follows the plane.
export const FLYOVER_CAMERA_PITCH = 80 // 0 looks straight down, 90 the horizon
export const FLYOVER_CAMERA_BEARING_RESPONSE = 5 // higher values follow heading tighter
export const FLYOVER_MAX_FRAME_SECONDS = 0.1 // longest step after a stalled frame

// The camera follows a ground level smoothed from the terrain around the plane,
// so flying over mountains does not make it bounce up and down. The level blends
// the average (0) and the highest point (1) found within the sample radius.
export const FLYOVER_TERRAIN_SAMPLE_RADIUS = 2000 // meters
export const FLYOVER_TERRAIN_HIGHEST_WEIGHT = 0.5
export const FLYOVER_TERRAIN_SAMPLE_INTERVAL = 100 // milliseconds between samples
export const FLYOVER_TERRAIN_RISE_RESPONSE = 2 // higher values climb over ridges sooner
export const FLYOVER_TERRAIN_FALL_RESPONSE = 0.7 // higher values follow valleys down sooner

// Transitions into and out of flyover mode, in milliseconds.
export const FLYOVER_ENTER_DURATION = 2600
export const FLYOVER_EXIT_DURATION = 1800 // the plane leaving the screen

// When flyover ends the map zooms out to this level and tilts to this pitch.
export const FLYOVER_EXIT_ZOOM = 12
export const FLYOVER_EXIT_PITCH = 60
export const FLYOVER_EXIT_CAMERA_DURATION = 2800

// Selecting a map marker while flying carries the plane toward it. The plane
// climbs on the way, returns to its starting altitude, stops short of the marker,
// and slows to the slowest speed.
export const FLYOVER_POI_TRAVEL_DURATION = 1200
export const FLYOVER_POI_PEAK_ALTITUDE_RATIO = 0.2 // peak altitude as a share of the trip distance
export const FLYOVER_POI_ARRIVAL_VIEW_SCALE = 1 // 1 puts the marker at the view center; more stops further back

// How often the map markers regroup while flying, in milliseconds.
export const FLYOVER_MARKER_UPDATE_INTERVAL = 200

// The plane model. The FBX nose points along +Z, so it is turned to face away.
export const FLYOVER_PLANE_MODEL_ROTATION_DEGREES = { x: 0, y: 180, z: 0 }
export const FLYOVER_PLANE_SIZE = 2.2 // wingspan in scene units

// The view of the plane drawn over the map.
export const FLYOVER_PLANE_VIEW = {
  fov: 35,
  cameraPosition: [0, 3.2, 9],
  lookAt: [0, 1, -3],
} as const

// Plane motion while flying and during transitions.
export const FLYOVER_PLANE_MAX_BANK = 30 // roll at full steering
export const FLYOVER_PLANE_MAX_PITCH = 20 // nose angle at full climb or descent
export const FLYOVER_PLANE_ENTER_OFFSET = -2.2 // start below the screen; 1 is half the screen height
export const FLYOVER_PLANE_ENTER_PITCH = 18 // nose-up angle while catching up to the camera
export const FLYOVER_PLANE_EXIT_OFFSET_X = -2 // finish left of the screen; 1 is half the screen width
export const FLYOVER_PLANE_EXIT_OFFSET_Y = 0.35
export const FLYOVER_PLANE_EXIT_YAW = -75
export const FLYOVER_PLANE_EXIT_ROLL = -40
export const FLYOVER_PLANE_EXIT_SCALE = 0.55
