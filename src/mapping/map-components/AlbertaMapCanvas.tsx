/**
  File: AlbertaMapCanvas.tsx | Author: Chace Nielson
  Date Created: Nov 8, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Render the MapLibre canvas, POI layer, and map overlays.

  Usage:
  - Composed by AlbertaMap inside the map controls context.

  Notes:
  - Map state and interactions are supplied by the AlbertaMap coordinator.
 */
import type { ReactNode } from 'react'
import { Map } from 'react-map-gl/maplibre'
import type { MapRef } from 'react-map-gl/maplibre'
import type { StyleSpecification } from 'maplibre-gl'
import * as maplibregl from 'maplibre-gl'
import type { Map as MapLibreMap } from 'maplibre-gl'
import mapWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url'
import type { MapPoi } from '../components/MapPoiMarker'
import type { PoiRenderGroup } from '../map-functions/clusterMapPois'
import { MapOverlayLayer, type MapOverlayLayerProps } from './MapOverlayLayer'
import { MapPoiLayer } from './MapPoiLayer'
import 'maplibre-gl/dist/maplibre-gl.css'

maplibregl.setWorkerUrl(mapWorkerUrl)

type InitialMapView = {
  longitude: number
  latitude: number
  zoom: number
  pitch: number
  bearing: number
}

type AlbertaMapCanvasProps = Omit<
  MapOverlayLayerProps,
  | 'isPlaneTutorialActive'
  | 'isPlaneTutorialControlsStep'
  | 'onFinishPlaneTutorial'
  | 'onPlaneTutorialControlsStepChange'
> & {
  ariaLabel: string
  moduleId?: string
  initialMapView: InitialMapView
  mapStyle: string | StyleSpecification
  minZoom: number
  maxZoom: number
  mapRefCallback: (map: MapRef | null) => void
  onMapLoad: (map: MapLibreMap) => void
  onMapError: (error: unknown) => void
  groups: readonly PoiRenderGroup[]
  onPoiActivate: (poi: MapPoi, origin?: Element | null) => void
  onClusterActivate: (
    coordinates: [number, number],
    expansionZoom: number,
  ) => void
  isPlaneTutorialActive: boolean
  isPlaneTutorialControlsStep: boolean
  onFinishPlaneTutorial: () => void
  onPlaneTutorialControlsStepChange: (isControlsStep: boolean) => void
  children?: ReactNode
}

export function AlbertaMapCanvas({
  ariaLabel,
  moduleId,
  initialMapView,
  mapStyle,
  minZoom,
  maxZoom,
  mapRefCallback,
  onMapLoad,
  onMapError,
  groups,
  onPoiActivate,
  onClusterActivate,
  isPlaneTutorialActive,
  isPlaneTutorialControlsStep,
  onFinishPlaneTutorial,
  onPlaneTutorialControlsStepChange,
  ...overlayProps
}: AlbertaMapCanvasProps) {
  return (
    <div
      role="region"
      aria-label={ariaLabel}
      data-module-id={moduleId}
      className="absolute inset-0"
    >
      <Map
        ref={mapRefCallback}
        mapLib={maplibregl}
        initialViewState={initialMapView}
        mapStyle={mapStyle}
        minZoom={minZoom}
        maxZoom={maxZoom}
        attributionControl={false}
        style={{ width: '100%', height: '100%' }}
        onLoad={(event) => onMapLoad(event.target)}
        onError={(event) => onMapError(event.error)}
      >
        {/* <AttributionControl
          position="top-right"
          compact
          // customAttribution='<a href="https://maplibre.org/" target="_blank" rel="noopener">MapLibre</a>'
        /> */}
        <MapPoiLayer
          groups={groups}
          activePoiId={overlayProps.activePoiId}
          onPoiActivate={onPoiActivate}
          onClusterActivate={onClusterActivate}
        />
      </Map>
      <MapOverlayLayer
        {...overlayProps}
        isMapReady={overlayProps.isMapReady}
        isPlaneTutorialActive={isPlaneTutorialActive}
        isPlaneTutorialControlsStep={isPlaneTutorialControlsStep}
        onFinishPlaneTutorial={onFinishPlaneTutorial}
        onPlaneTutorialControlsStepChange={onPlaneTutorialControlsStepChange}
      />
    </div>
  )
}
