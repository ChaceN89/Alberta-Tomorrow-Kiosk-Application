/**
  File: mapSettings.ts | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Oct 30, 2026 - CN - Configure map feature defaults.

  Description:
  - Store general map defaults, zoom boundaries, and startup feature visibility.

  Usage:
  - Imported by AlbertaMap to configure the shared map instance and its controls.

  Notes:
  - Specialized basemap, terrain, and POI settings live in separate files.
 */

// min and max zoom settings as well
export const ZOOM_MIN = 0
export const ZOOM_MAX = 25
export const CAMERA_MOVE_DURATION = 200

// the defaults for the initial view of the site
export const INITIAL_VIEW = {
  longitude: -114.0719,
  latitude: 53.5461,
  zoom: 5.25,
  pitch: 0,
  bearing: 0,
}

// Hillshading starts enabled.
export const HILLSHADING_DEFAULT = true

// Satellite imagery starts disabled.
export const SATELLITE_IMAGE_DEFAULT = false

// Start with terrain enabled.
export const START_IN_3D_DEFAULT = true

// Start with point-of-interest icons and labels hidden.
export const ICONS_DEFAULT = false
