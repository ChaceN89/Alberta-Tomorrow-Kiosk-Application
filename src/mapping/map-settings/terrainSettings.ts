/**
  File: terrainSettings.ts | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Define terrain source, exaggeration, hillshade, and 3D camera settings.

  Usage:
  - Imported by AlbertaMap and MapControls.

  Notes:
  - The exaggeration bounds are integers configured for the map controls.
 */
import type { RasterDEMSourceSpecification } from 'maplibre-gl'

export const TERRAIN_SOURCE_ID = 'alberta-terrain-dem'
export const HILLSHADE_LAYER_ID = 'alberta-terrain-hillshade'

export const TERRAIN_EXAGGERATION_MIN = 0
export const TERRAIN_EXAGGERATION_MAX = 6
export const DEFAULT_TERRAIN_EXAGGERATION = 2

export const MAX_CAMERA_PITCH = 90
export const DEFAULT_TERRAIN_PITCH = 60
export const TERRAIN_TRANSITION_DURATION = 700

export const TERRAIN_SOURCE: RasterDEMSourceSpecification = {
  type: 'raster-dem',
  tiles: ['https://tiles.mapterhorn.com/{z}/{x}/{y}.webp'],
  encoding: 'terrarium',
  tileSize: 512,
  maxzoom: 15, // Mapterhorn has no tiles above 15; closer views reuse them.
  attribution: '<a href="https://mapterhorn.com/attribution">© Mapterhorn</a>',
}
