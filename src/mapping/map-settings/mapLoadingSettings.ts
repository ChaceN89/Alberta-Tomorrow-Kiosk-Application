/**
  File: mapLoadingSettings.ts | Author: Chace Nielson
  Date Created: Nov 9, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Configure regional terrain coverage and initial scene readiness.

  Usage:
  - Used by terrainSettings and the map startup gate.

  Notes:
  - Tile bounds are rectangular and do not restrict camera navigation.
 */
export const MAP_TERRAIN_BUFFER_KM = 200
export const MAP_TERRAIN_EXTRA_WEST_BUFFER_KM = 200
export const MAP_STARTUP_TIMEOUT_MS = 30_000
export const MAP_STARTUP_SETTLE_MS = 350
export const MAP_REVEAL_DURATION_MS = 500
export const MAP_STARTUP_MOVEMENT_DELAY_MS = 500

const latitudeBuffer = MAP_TERRAIN_BUFFER_KM / 111.195
const longitudeBuffer =
  latitudeBuffer / Math.cos(((60 + latitudeBuffer) * Math.PI) / 180)
const extraWestLongitudeBuffer =
  MAP_TERRAIN_EXTRA_WEST_BUFFER_KM /
  111.195 /
  Math.cos(((60 + latitudeBuffer) * Math.PI) / 180)

export const MAP_TERRAIN_BOUNDS: [number, number, number, number] = [
  -120 - longitudeBuffer - extraWestLongitudeBuffer,
  49 - latitudeBuffer,
  -110 + longitudeBuffer,
  60 + latitudeBuffer,
]
