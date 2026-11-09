/**
  File: flightMiniMap.ts | Author: Chace Nielson
  Date Created: Nov 9, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Project a lightweight Alberta overview and live flight positions into SVG.

  Usage:
  - Used by FlyoverPoiCompass for its north-up mini-map.

  Notes:
  - The outline is schematic, not a survey boundary. Padding includes the southern spawn.
 */
const SCALE = 12
const LONGITUDE_SCALE = Math.cos((55 * Math.PI) / 180)

export function projectFlightMiniMap(longitude: number, latitude: number) {
  return {
    x: 8 + (longitude + 120) * SCALE * LONGITUDE_SCALE,
    y: 8 + (60 - latitude) * SCALE,
  }
}

const OUTLINE: readonly (readonly [number, number])[] = [
  [-120, 60],
  [-110, 60],
  [-110, 49],
  [-114.07, 49],
  [-114.6, 49.5],
  [-114.7, 50],
  [-115.2, 50.2],
  [-115.3, 50.6],
  [-115.8, 51],
  [-116.1, 51.3],
  [-116.5, 51.8],
  [-117.1, 52.1],
  [-117.4, 52.5],
  [-118, 52.8],
  [-118.4, 53.2],
  [-119, 53.4],
  [-119.5, 53.5],
  [-120, 53.8],
]

export const FLIGHT_MINI_MAP_PATH =
  OUTLINE.map(([longitude, latitude], index) => {
    const { x, y } = projectFlightMiniMap(longitude, latitude)
    return `${index === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)}`
  }).join(' ') + ' Z'
