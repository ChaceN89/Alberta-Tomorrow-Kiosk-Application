/**
  File: mapLayerFunctions.ts | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Create and control the shared map's custom sources and layers.

  Usage:
  - Imported by useAlbertaMapController.

  Notes:
  - Basemap style layers are selected by their source-layer metadata.
 */
import type { Map as MapLibreMap } from 'maplibre-gl'
import {
  ALBERTA_BOUNDARY_COLOR,
  ALBERTA_BOUNDARY_FILL_LAYER_ID,
  ALBERTA_BOUNDARY_FILL_OPACITY,
  ALBERTA_BOUNDARY_LINE_OPACITY,
  ALBERTA_BOUNDARY_LINE_WIDTH,
  ALBERTA_BOUNDARY_OUTLINE_LAYER_ID,
  ALBERTA_BOUNDARY_SOURCE_ID,
  ALBERTA_BOUNDARY_URL,
} from '../map-settings/mapSettings'
import {
  SATELLITE_LAYER_ID,
  SATELLITE_SOURCE,
  SATELLITE_SOURCE_ID,
} from '../map-settings/baseMapSettings'
import {
  HILLSHADE_LAYER_ID,
  TERRAIN_SOURCE,
  TERRAIN_SOURCE_ID,
} from '../map-settings/terrainSettings'

// Function: Find the first symbol layer so custom imagery stays below labels.
function getFirstSymbolLayerId(map: MapLibreMap) {
  return map.getStyle().layers?.find(({ type }) => type === 'symbol')?.id
}

// Function: Add the elevation source only when it is missing from the style.
export function ensureTerrainSource(map: MapLibreMap) {
  if (map.getSource(TERRAIN_SOURCE_ID)) return
  map.addSource(TERRAIN_SOURCE_ID, TERRAIN_SOURCE)
}

// Function: Add a hillshade layer below labels when it is not already present.
export function ensureHillshadeLayer(map: MapLibreMap) {
  if (!map.getLayer(HILLSHADE_LAYER_ID)) {
    map.addLayer(
      {
        id: HILLSHADE_LAYER_ID,
        type: 'hillshade',
        source: TERRAIN_SOURCE_ID,
        layout: { visibility: 'visible' },
        paint: {
          'hillshade-exaggeration': 0.5,
          'hillshade-shadow-color': '#473b24',
          'hillshade-highlight-color': '#ffffff',
          'hillshade-accent-color': '#000000',
          'hillshade-illumination-direction': 315,
        },
      },
      getFirstSymbolLayerId(map),
    )
  }
}

// Function: Add satellite imagery below hillshade and labels.
export function ensureSatelliteLayer(map: MapLibreMap) {
  if (!map.getSource(SATELLITE_SOURCE_ID)) {
    map.addSource(SATELLITE_SOURCE_ID, SATELLITE_SOURCE)
  }

  if (!map.getLayer(SATELLITE_LAYER_ID)) {
    map.addLayer(
      {
        id: SATELLITE_LAYER_ID,
        type: 'raster',
        source: SATELLITE_SOURCE_ID,
        layout: { visibility: 'visible' },
      },
      map.getLayer(HILLSHADE_LAYER_ID)
        ? HILLSHADE_LAYER_ID
        : getFirstSymbolLayerId(map),
    )
  }
}

// Function: Add the Alberta boundary source, fill, and outline layers.
function ensureAlbertaBoundaryLayers(map: MapLibreMap) {
  if (!map.getSource(ALBERTA_BOUNDARY_SOURCE_ID)) {
    map.addSource(ALBERTA_BOUNDARY_SOURCE_ID, {
      type: 'geojson',
      data: ALBERTA_BOUNDARY_URL,
    })
  }

  if (!map.getLayer(ALBERTA_BOUNDARY_FILL_LAYER_ID)) {
    map.addLayer(
      {
        id: ALBERTA_BOUNDARY_FILL_LAYER_ID,
        type: 'fill',
        source: ALBERTA_BOUNDARY_SOURCE_ID,
        paint: {
          'fill-color': ALBERTA_BOUNDARY_COLOR,
          'fill-opacity': ALBERTA_BOUNDARY_FILL_OPACITY,
        },
      },
      getFirstSymbolLayerId(map),
    )
  }

  if (!map.getLayer(ALBERTA_BOUNDARY_OUTLINE_LAYER_ID)) {
    map.addLayer(
      {
        id: ALBERTA_BOUNDARY_OUTLINE_LAYER_ID,
        type: 'line',
        source: ALBERTA_BOUNDARY_SOURCE_ID,
        paint: {
          'line-color': ALBERTA_BOUNDARY_COLOR,
          'line-width': ALBERTA_BOUNDARY_LINE_WIDTH,
          'line-opacity': ALBERTA_BOUNDARY_LINE_OPACITY,
        },
      },
      getFirstSymbolLayerId(map),
    )
  }
}

// Function: Create or hide the Alberta boundary layers.
export function setAlbertaBoundaryVisibility(
  map: MapLibreMap,
  isVisible: boolean,
) {
  if (isVisible) {
    ensureAlbertaBoundaryLayers(map)
  }

  const visibility = isVisible ? 'visible' : 'none'
  for (const layerId of [
    ALBERTA_BOUNDARY_FILL_LAYER_ID,
    ALBERTA_BOUNDARY_OUTLINE_LAYER_ID,
  ]) {
    if (map.getLayer(layerId)) {
      map.setLayoutProperty(layerId, 'visibility', visibility)
    }
  }
}

// Function: Show or hide built-in place icons and labels in the basemap.
export function setBasemapPlacesVisibility(
  map: MapLibreMap,
  isVisible: boolean,
) {
  const placeLayers =
    map
      .getStyle()
      .layers?.filter(
        (layer) =>
          layer.type === 'symbol' &&
          'source-layer' in layer &&
          (layer['source-layer'] === 'poi' || layer['source-layer'] === 'park'),
      ) ?? []

  if (placeLayers.length === 0) {
    throw new Error('The active basemap has no built-in place symbol layers.')
  }

  const visibility = isVisible ? 'visible' : 'none'
  for (const layer of placeLayers) {
    map.setLayoutProperty(layer.id, 'visibility', visibility)
  }
}
