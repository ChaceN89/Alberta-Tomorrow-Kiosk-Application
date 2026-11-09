/**
  File: baseMapSettings.ts | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Define available vector and satellite basemap styles.

  Usage:
  - Imported by AlbertaMap and MapControls.

  Notes:
  - Satellite is represented by a raster-only MapLibre style.
 */
import type { RasterSourceSpecification, StyleSpecification } from 'maplibre-gl'

export const SATELLITE_BASEMAP_STYLE_ID = 'satellite'
const SATELLITE_SOURCE_ID = 'alberta-satellite'
const SATELLITE_LAYER_ID = 'alberta-satellite-imagery'

const SATELLITE_SOURCE: RasterSourceSpecification = {
  type: 'raster',
  tiles: [
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  ],
  tileSize: 256,
  maxzoom: 19,
  attribution:
    'Source: Esri, Vantor, Earthstar Geographics, and the GIS User Community',
}

// helper to use the satellite as a basemap style
const SATELLITE_BASEMAP_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    [SATELLITE_SOURCE_ID]: SATELLITE_SOURCE,
  },
  layers: [
    {
      id: SATELLITE_LAYER_ID,
      type: 'raster',
      source: SATELLITE_SOURCE_ID,
    },
  ],
}

export const BASEMAP_STYLES = [
  {
    id: 'liberty',
    style: 'https://tiles.openfreemap.org/styles/liberty',
    labelKey: 'view.basemapStyles.liberty',
  },
  {
    id: SATELLITE_BASEMAP_STYLE_ID,
    style: SATELLITE_BASEMAP_STYLE,
    labelKey: 'view.basemapStyles.satellite',
  },
  {
    id: 'dark',
    style: 'https://tiles.openfreemap.org/styles/dark',
    labelKey: 'view.basemapStyles.dark',
  },
  {
    id: 'bright',
    style: 'https://tiles.openfreemap.org/styles/bright',
    labelKey: 'view.basemapStyles.bright',
  },
  {
    id: 'fiord',
    style: 'https://tiles.openfreemap.org/styles/fiord',
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
