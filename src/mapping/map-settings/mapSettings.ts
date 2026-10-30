/**
  File: mapSettings.ts | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Oct 30, 2026 - CN - Configure Alberta boundary defaults.

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
export const CAMERA_MOVE_DURATION = 200 // in milliseconds

// the defaults for the initial view of the site
export const INITIAL_VIEW = {
  longitude: -114.0719,
  latitude: 53.5461,
  zoom: 5.4,
  pitch: 0,
  bearing: 0,
}

// Hillshading starts enabled.
export const HILLSHADING_DEFAULT = true

// Satellite imagery starts disabled.
export const SATELLITE_IMAGE_DEFAULT = false

// Start with terrain enabled.
export const START_IN_3D_DEFAULT = true

// Start with basemap place icons and labels hidden.
export const BASEMAP_PLACES_DEFAULT = false

// settings related to the Alberta boundary layer
export const ALBERTA_BOUNDARY_DEFAULT = true
export const ALBERTA_BOUNDARY_SOURCE_ID = 'alberta-boundary'
export const ALBERTA_BOUNDARY_FILL_LAYER_ID = 'alberta-boundary-fill'
export const ALBERTA_BOUNDARY_OUTLINE_LAYER_ID = 'alberta-boundary-outline'
export const ALBERTA_BOUNDARY_COLOR = '#204a37'
export const ALBERTA_BOUNDARY_FILL_OPACITY = 0 // Fully transparent by default.
export const ALBERTA_BOUNDARY_LINE_OPACITY = 0.95 // Mostly opaque by default.
export const ALBERTA_BOUNDARY_LINE_WIDTH = 4
export const ALBERTA_BOUNDARY_URL =
  'https://services2.arcgis.com/jQV6VMr2Loovu7GU/arcgis/rest/services/Provincial_Boundary_FGDB/FeatureServer/0/query' +
  '?where=1%3D1&outFields=OBJECTID&returnGeometry=true&outSR=4326&f=geojson'
