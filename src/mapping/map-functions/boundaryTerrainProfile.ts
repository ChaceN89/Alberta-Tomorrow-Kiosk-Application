/**
  File: boundaryTerrainProfile.ts | Author: Chace Nielson
  Date Created: Nov 9, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Smooth a closed boundary's sampled terrain without lowering its top below peaks.

  Usage:
  - The boundary wall adds its configured clearance to this elevation profile.

  Notes:
  - A quadratic upper envelope rounds mountain transitions and wraps at the seam.
 */
export function smoothBoundaryTerrain(
  distances: readonly number[],
  elevations: readonly number[],
  perimeter: number,
  smoothingMeters: number,
): number[] {
  if (smoothingMeters <= 0) return [...elevations]
  return elevations.map((elevation, index) => {
    let height = elevation
    // At 2 smoothing radii the envelope is 4 radii lower, beyond terrain relief.
    for (const direction of [-1, 1]) {
      for (let step = 1; step < elevations.length; step++) {
        const neighbor =
          (index + direction * step + elevations.length) % elevations.length
        const distance =
          (direction * (distances[neighbor] - distances[index]) + perimeter) %
          perimeter
        if (distance > smoothingMeters * 2) break
        height = Math.max(
          height,
          elevations[neighbor] - (distance * distance) / smoothingMeters,
        )
      }
    }
    return height
  })
}
