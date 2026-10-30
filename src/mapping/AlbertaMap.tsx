/**
  File: AlbertaMap.tsx | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Render the shared, interactive map centered on Alberta.

  Usage:
  - Used by the default and module-specific explore views.

  Notes:
  - The base map style is provided by OpenFreeMap and needs no API key.
 */
import { Map, NavigationControl } from 'react-map-gl/maplibre'
import * as maplibregl from 'maplibre-gl'
import mapWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url'
import 'maplibre-gl/dist/maplibre-gl.css'

const albertaMapStyle = 'https://tiles.openfreemap.org/styles/liberty'

maplibregl.setWorkerUrl(mapWorkerUrl)

type AlbertaMapProps = {
  ariaLabel: string
}

export function AlbertaMap({ ariaLabel }: AlbertaMapProps) {
  return (
    <div role="region" aria-label={ariaLabel} className="absolute inset-0">
      <Map
        mapLib={maplibregl}
        initialViewState={{
          longitude: -114.0719,
          latitude: 53.5461,
          zoom: 5.25,
        }}
        mapStyle={albertaMapStyle}
        style={{ width: '100%', height: '100%' }}
      >
        <NavigationControl position="bottom-right" showCompass={false} />
      </Map>
    </div>
  )
}
