/**
  File: baseMapSettings.ts | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Define available vector basemaps and satellite imagery.

  Usage:
  - Imported by AlbertaMap and MapControls.

  Notes:
  - Includes every style currently published by OpenFreeMap.
 */
import type { RasterSourceSpecification } from 'maplibre-gl'

export const BASEMAP_STYLES = [
  {
    id: 'liberty',
    url: 'https://tiles.openfreemap.org/styles/liberty',
    labelKey: 'view.basemapStyles.liberty',
  },
  {
    id: 'bright',
    url: 'https://tiles.openfreemap.org/styles/bright',
    labelKey: 'view.basemapStyles.bright',
  },
  {
    id: 'positron',
    url: 'https://tiles.openfreemap.org/styles/positron',
    labelKey: 'view.basemapStyles.positron',
  },
  {
    id: 'dark',
    url: 'https://tiles.openfreemap.org/styles/dark',
    labelKey: 'view.basemapStyles.dark',
  },
  {
    id: 'fiord',
    url: 'https://tiles.openfreemap.org/styles/fiord',
    labelKey: 'view.basemapStyles.fiord',
  },
] as const

export type BasemapStyleId = (typeof BASEMAP_STYLES)[number]['id']

export const DEFAULT_BASEMAP_STYLE_ID: BasemapStyleId = 'liberty'

export function getBasemapStyle(styleId: string) {
  const style = BASEMAP_STYLES.find(({ id }) => id === styleId)

  if (!style) {
    throw new Error(`Unknown basemap style "${styleId}"`)
  }

  return style
}

export const SATELLITE_SOURCE_ID = 'alberta-satellite'
export const SATELLITE_LAYER_ID = 'alberta-satellite-imagery'

export const SATELLITE_SOURCE: RasterSourceSpecification = {
  type: 'raster',
  tiles: [
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  ],
  tileSize: 256,
  maxzoom: 19,
  attribution:
    'Tiles © Esri, Maxar, Earthstar Geographics, and the GIS User Community',
}
