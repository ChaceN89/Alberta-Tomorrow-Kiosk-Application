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
import type { ReactNode, RefObject } from 'react'
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
import { FlyoverPoiLayer } from '../flyover/components/FlyoverPoiLayer'
import { FlightPlaneLayer } from '../flyover/components/FlightPlaneLayer'
import type { FlightState } from '../flyover/types'
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
  isInteractive: boolean
  isFlyoverExiting: boolean
  onAircraftReady: () => void
  onAircraftError: (error: unknown) => void
  moduleId?: string
  initialMapView: InitialMapView
  mapStyle: string | StyleSpecification
  minZoom: number
  maxZoom: number
  mapRefCallback: (map: MapRef | null) => void
  onMapLoad: (map: MapLibreMap) => void
  onMapError: (error: unknown) => void
  groups: readonly PoiRenderGroup[]
  infoPoiId: string | null
  flightPositionRef: RefObject<FlightState | null>
  getFlightElevation: () => number | null
  isPreparingFlyover: boolean
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
  isInteractive,
  isFlyoverExiting,
  onAircraftReady,
  onAircraftError,
  moduleId,
  initialMapView,
  mapStyle,
  minZoom,
  maxZoom,
  mapRefCallback,
  onMapLoad,
  onMapError,
  groups,
  infoPoiId,
  flightPositionRef,
  getFlightElevation,
  isPreparingFlyover,
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
        scrollZoom={isInteractive && !overlayProps.isFlyoverActive}
        boxZoom={isInteractive && !overlayProps.isFlyoverActive}
        dragRotate={isInteractive && !overlayProps.isFlyoverActive}
        dragPan={isInteractive && !overlayProps.isFlyoverActive}
        keyboard={isInteractive && !overlayProps.isFlyoverActive}
        doubleClickZoom={isInteractive && !overlayProps.isFlyoverActive}
        touchZoomRotate={isInteractive && !overlayProps.isFlyoverActive}
        touchPitch={isInteractive && !overlayProps.isFlyoverActive}
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
        {overlayProps.isFlyoverActive ? (
          <FlyoverPoiLayer
            isExiting={isFlyoverExiting}
            pois={overlayProps.pois}
            activePoiId={overlayProps.activePoiId}
            infoPoiId={infoPoiId}
            flightPositionRef={flightPositionRef}
            getFlightElevation={getFlightElevation}
            onPoiActivate={onPoiActivate}
          />
        ) : (
          <MapPoiLayer
            groups={groups}
            activePoiId={overlayProps.activePoiId}
            infoPoiId={infoPoiId}
            onPoiActivate={onPoiActivate}
            onClusterActivate={onClusterActivate}
            isPreparingFlyover={isPreparingFlyover}
          />
        )}
      </Map>
      {overlayProps.isFlyoverActive && (
        <FlightPlaneLayer
          visualRef={overlayProps.visualRef}
          onReady={onAircraftReady}
          onError={onAircraftError}
        />
      )}
      <MapOverlayLayer
        isInteractive={isInteractive}
        {...overlayProps}
        infoPoiId={infoPoiId}
        flightPositionRef={flightPositionRef}
        isMapReady={overlayProps.isMapReady && isInteractive}
        isPlaneTutorialActive={isPlaneTutorialActive}
        isPlaneTutorialControlsStep={isPlaneTutorialControlsStep}
        onFinishPlaneTutorial={onFinishPlaneTutorial}
        onPlaneTutorialControlsStepChange={onPlaneTutorialControlsStepChange}
      />
    </div>
  )
}
