/**
  File: terrainSettings.ts | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Define terrain source, exaggeration, hillshade, and 3D camera settings.

  Usage:
  - Imported by AlbertaMap and MapControls.

  Notes:
  - Exaggeration can be adjusted in half-step increments from 0 to 3.
 */
import type { RasterDEMSourceSpecification } from 'maplibre-gl'

export const TERRAIN_SOURCE_ID = 'alberta-terrain-dem'
export const HILLSHADE_LAYER_ID = 'alberta-terrain-hillshade'

export const TERRAIN_EXAGGERATION_MIN = 0
export const TERRAIN_EXAGGERATION_MAX = 3
export const TERRAIN_EXAGGERATION_STEP = 0.5
export const DEFAULT_TERRAIN_EXAGGERATION = 1

export const MAX_CAMERA_PITCH = 90
export const DEFAULT_TERRAIN_PITCH = 50
export const TERRAIN_TRANSITION_DURATION = 500

export const TERRAIN_SOURCE: RasterDEMSourceSpecification = {
  type: 'raster-dem',
  tiles: ['https://tiles.mapterhorn.com/{z}/{x}/{y}.webp'],
  encoding: 'terrarium',
  tileSize: 512,
  maxzoom: 15, // Mapterhorn has no tiles above 15; closer views reuse them.
  attribution: '<a href="https://mapterhorn.com/attribution">© Mapterhorn</a>',
}
