/**
  File: AlbertaMap.tsx | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Render the shared Alberta map and its map controls.

  Usage:
  - Used by default and module-specific explore views.
  - The parent must provide a positioned container with a defined height.

  Notes:
  - Map state and behavior are managed by useAlbertaMapController.
 */
import type { ReactNode } from 'react'
import { Map, NavigationControl } from 'react-map-gl/maplibre'
import * as maplibregl from 'maplibre-gl'
import mapWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url'
import { MapControlsContext } from './components/MapControlsContext'
import { useAlbertaMapController } from './map-functions/useAlbertaMapController'
import 'maplibre-gl/dist/maplibre-gl.css'

maplibregl.setWorkerUrl(mapWorkerUrl)

type AlbertaMapProps = {
  ariaLabel: string
  moduleId?: string
  children?: ReactNode
}

// Function: Render MapLibre and provide its controls to the explore-page UI.
export function AlbertaMap({ ariaLabel, moduleId, children }: AlbertaMapProps) {
  const {
    controls,
    mapRef,
    initialMapView,
    mapStyle,
    minZoom,
    maxZoom,
    onMapLoad,
    onMapError,
  } = useAlbertaMapController()

  return (
    <MapControlsContext.Provider value={controls}>
      <div
        role="region"
        aria-label={ariaLabel}
        data-module-id={moduleId}
        className="absolute inset-0"
      >
        <Map
          ref={mapRef}
          mapLib={maplibregl}
          initialViewState={initialMapView}
          mapStyle={mapStyle}
          minZoom={minZoom}
          maxZoom={maxZoom}
          style={{ width: '100%', height: '100%' }}
          onLoad={(event) => onMapLoad(event.target)}
          onError={(event) => onMapError(event.error)}
        >
          <NavigationControl
            position="bottom-right"
            showCompass
            visualizePitch
          />
        </Map>

        {children}
      </div>
    </MapControlsContext.Provider>
  )
}
