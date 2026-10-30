/**
  File: AlbertaMap.tsx | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Render the shared, interactive map centered on Alberta.

  Usage:
  - Used by the default and module-specific explore views.

  Notes:
  - The base map and terrain sources are provided by OpenFreeMap and Mapterhorn.
 */
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Map, NavigationControl, Source } from 'react-map-gl/maplibre'
import type { MapRef } from 'react-map-gl/maplibre'
import * as maplibregl from 'maplibre-gl'
import mapWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url'
import 'maplibre-gl/dist/maplibre-gl.css'

const albertaMapStyle = 'https://tiles.openfreemap.org/styles/liberty'
const terrainSourceId = 'alberta-terrain-dem'

maplibregl.setWorkerUrl(mapWorkerUrl)

type AlbertaMapProps = {
  ariaLabel: string
  moduleId?: string
}

export function AlbertaMap({ ariaLabel, moduleId }: AlbertaMapProps) {
  const { t } = useTranslation('mapping')
  const [isTerrainEnabled, setIsTerrainEnabled] = useState(false)
  const mapRef = useRef<MapRef>(null)

  const toggleTerrain = () => {
    const shouldEnableTerrain = !isTerrainEnabled
    setIsTerrainEnabled(shouldEnableTerrain)
    mapRef.current?.getMap().easeTo({
      pitch: shouldEnableTerrain ? 60 : 0,
      duration: 700,
    })
  }

  return (
    <div
      role="region"
      aria-label={ariaLabel}
      data-module-id={moduleId}
      className="absolute inset-0"
    >
      <Map
        ref={mapRef}
        mapLib={maplibregl}
        initialViewState={{
          longitude: -114.0719,
          latitude: 53.5461,
          zoom: 5.25,
        }}
        maxPitch={70}
        mapStyle={albertaMapStyle}
        terrain={
          isTerrainEnabled
            ? { source: terrainSourceId, exaggeration: 1.25 }
            : undefined
        }
        style={{ width: '100%', height: '100%' }}
      >
        <Source
          id={terrainSourceId}
          type="raster-dem"
          url="https://tiles.mapterhorn.com/tilejson.json"
        />
        <NavigationControl position="bottom-right" showCompass={false} />
      </Map>
      <button
        type="button"
        className="absolute bottom-4 left-4 z-(--z-content-popover) flex min-h-12 items-center rounded-full border border-line bg-surface px-4 font-semibold text-pine shadow-lg hover:bg-canvas focus-visible:outline-2 focus-visible:outline-offset-2"
        aria-label={t(
          isTerrainEnabled ? 'terrain.switchTo2d' : 'terrain.switchTo3d',
        )}
        aria-pressed={isTerrainEnabled}
        onClick={toggleTerrain}
      >
        {t(isTerrainEnabled ? 'terrain.mode3d' : 'terrain.mode2d')}
      </button>
    </div>
  )
}
