/**
  File: terrainSampler.ts | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Work out a steady ground elevation from the terrain around the plane.

  Usage:
  - Imported by useFlyoverControls.

  Notes:
  - A single height under the plane jumps over every ridge. Blending the average
    and the highest of many heights within a radius keeps the camera steady
    over mountains. Heights include the terrain exaggeration, as drawn.
 */
import type { Map as MapLibreMap } from 'maplibre-gl'
import {
  FLYOVER_TERRAIN_HIGHEST_WEIGHT,
  FLYOVER_TERRAIN_SAMPLE_RADIUS,
} from '../../map-settings/flyoverSettings'
import { lerp, moveAlongHeading } from './flightMath'

const RING_SCALES = [0.5, 1]
const SAMPLES_PER_RING = 8

// Function: Ground elevation around a position, or null while no terrain has loaded there.
export function sampleGroundElevation(
  map: MapLibreMap,
  longitude: number,
  latitude: number,
) {
  const heights: number[] = []
  const addHeight = (lng: number, lat: number) => {
    const height = map.queryTerrainElevation([lng, lat])
    if (height !== null && Number.isFinite(height)) heights.push(height)
  }

  addHeight(longitude, latitude)
  for (const scale of RING_SCALES) {
    for (let index = 0; index < SAMPLES_PER_RING; index++) {
      const point = moveAlongHeading(
        longitude,
        latitude,
        (index * 360) / SAMPLES_PER_RING,
        FLYOVER_TERRAIN_SAMPLE_RADIUS * scale,
      )
      addHeight(point.longitude, point.latitude)
    }
  }

  if (heights.length === 0) return null

  const average =
    heights.reduce((sum, height) => sum + height, 0) / heights.length
  return lerp(average, Math.max(...heights), FLYOVER_TERRAIN_HIGHEST_WEIGHT)
}
