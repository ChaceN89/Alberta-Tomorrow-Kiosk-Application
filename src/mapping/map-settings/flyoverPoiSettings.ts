/**
  File: flyoverPoiSettings.ts | Author: Chace Nielson
  Date Created: Nov 9, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Configure flight POI cylinders, distance fading, and repeat visits.

  Usage:
  - Shared by flight POI rendering and entry detection.

  Notes:
  - POIs may multiply the shared radius; entry ignores flight altitude.
  - Settings apply only during flyover; normal map markers are unchanged.
  - Cylinder bottoms share sea level (0 m), regardless of local terrain.
 */
// Horizontal entry radius in meters, independent of flight altitude.
// Each POI can scale this with flyoverRadiusMultiplier (default 1; 0.5 halves it).
// Rendering, entry detection, repeat visits, and the inside tint share this radius.
export const FLYOVER_POI_RADIUS_METERS = 2000

// Cylinder top elevation in meters above sea level. Cylinders grow from 0 m
// during plane entry. Each POI can scale this with flyoverCylinderHeightMultiplier.
export const FLYOVER_POI_HEIGHT_METERS = 6000

// Marker height above the cylinder top, in meters; positive places it above.
// This fixed offset is shared by all POIs, regardless of their cylinder height scale.
// Markers rise from local terrain to this final elevation during plane entry.
export const FLYOVER_POI_HEIGHT_ABOVE_CYLINDER_METERS = 200

// Screen-space separation starts after cylinder growth finishes; POIs stay fixed.
export const FLYOVER_POI_LABEL_GAP_PIXELS = 3
export const FLYOVER_POI_LABEL_MAX_OFFSET_PIXELS = 50
export const FLYOVER_POI_LABEL_MAX_LIFT_PIXELS = 80
// Smooth damping time (ms); reduced motion applies offsets instantly.
export const FLYOVER_POI_LABEL_MOVE_DURATION_MS = 650
export const FLYOVER_POI_LABEL_TOP_PADDING_PIXELS = 8
// Only pull labels just above the viewport onto its top edge; fade over this band.
export const FLYOVER_POI_LABEL_TOP_PULL_PIXELS = 120
export const FLYOVER_POI_LABEL_TOP_FADE_PIXELS = 60

// Continuous time outside a visited cylinder before it can trigger again (ms).
// Returning inside before this delay finishes restarts the outside timer.
export const FLYOVER_POI_REARM_DELAY_MS = 1000

// Horizontal distance from the plane at which markers and cylinders disappear (m).
// Must be greater than FADE_DISTANCE_METERS; this does not change the entry radius.
export const FLYOVER_POI_ENTRY_DISTANCE_METERS = 500000 // 500 km

// Horizontal distance within which markers reach full opacity (m).
// Between this and ENTRY_DISTANCE_METERS, visibility fades linearly to zero.
// Cylinders use the same fade, multiplied by CYLINDER_OPACITY.
export const FLYOVER_POI_FADE_DISTANCE_METERS = 50000 // 50 km

// Time for a full opacity transition (ms). POIs start fully visible and fade
// toward their distance-based opacity while their heights animate into place.
// Height animation matches plane entry; reduced motion skips both animations.
export const FLYOVER_POI_FADE_DURATION_MS = 600

// Maximum cylinder surface opacity: 0 is invisible, 1 is opaque.
// Closed, double-sided surfaces remain visible from inside and outside.
export const FLYOVER_POI_CYLINDER_OPACITY = 0.25

// Black top rim and camera-facing side edges; follows the POI's distance fade.
export const FLYOVER_POI_CYLINDER_OUTLINE_ENABLED = true
export const FLYOVER_POI_CYLINDER_OUTLINE_OPACITY = 0.7

// Screen tint opacity while the plane is within a cylinder's horizontal radius.
// Uses that POI's color; 0 disables the tint, 1 completely covers the map/plane.
// The tint does not block controls and ignores flight altitude like entry detection.
export const FLYOVER_POI_INSIDE_TINT_OPACITY = 0.12

// Cylinder and inside-tint colors; marker selection colors are configured separately.
export const FLYOVER_POI_COLORS = {
  active: '#ea580c', // Orange selected destination, ahead of completion colors.
  base: '#2563eb', // Shared base-map POIs.
  module: '#afb9c9', // Incomplete expedition POIs.
  complete: '#16a34a', // Completed expedition POIs.
} as const
