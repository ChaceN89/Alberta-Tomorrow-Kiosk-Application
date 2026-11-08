/**
  File: MapOverlayLayer.tsx | Author: Chace Nielson
  Date Created: Nov 8, 2026
  Date Updated: Nov 8, 2026

  Description:
  - Compose map selectors, flyover UI, tutorials, and caller-provided controls.

  Usage:
  - Rendered above the MapLibre canvas by AlbertaMapCanvas.

  Notes:
  - These overlays share the current map and flyover state.
 */
import type { ReactNode, RefObject } from 'react'
import { MapPoiSelector } from '../components/MapPoiSelector'
import { FlightPlaneLayer } from '../flyover/components/FlightPlaneLayer'
import { PlaneHud } from '../flyover/components/PlaneHud'
import type { FlightVisualState } from '../flyover/types'
import { ExploreMapTutorial } from '@/tutorials/specific-tutorials/explore-map/ExploreMapTutorial'
import { PlaneTutorial } from '@/tutorials/specific-tutorials/plane-tutorial/PlaneTutorial'
import type { MapPoi } from '../components/MapPoiMarker'

export type MapOverlayLayerProps = {
  pois: readonly MapPoi[]
  activePoiId: string | null
  onPoiSelect: (poi: MapPoi) => void
  isFlyoverActive: boolean
  isFlyoverPaused: boolean
  altitudeMeters: number
  speedMetersPerSecond: number
  latitude: number
  longitude: number
  visualRef: RefObject<FlightVisualState>
  isPlaneTutorialActive: boolean
  isPlaneTutorialControlsStep: boolean
  isMapReady: boolean
  onFinishPlaneTutorial: () => void
  onSetFlyoverPaused: (isPaused: boolean) => void
  onPlaneTutorialControlsStepChange: (isControlsStep: boolean) => void
  children?: ReactNode
}

export function MapOverlayLayer({
  pois,
  activePoiId,
  onPoiSelect,
  isFlyoverActive,
  isFlyoverPaused,
  altitudeMeters,
  speedMetersPerSecond,
  latitude,
  longitude,
  visualRef,
  isPlaneTutorialActive,
  isPlaneTutorialControlsStep,
  isMapReady,
  onFinishPlaneTutorial,
  onSetFlyoverPaused,
  onPlaneTutorialControlsStepChange,
  children,
}: MapOverlayLayerProps) {
  return (
    <>
      <MapPoiSelector
        pois={pois}
        activePoiId={activePoiId}
        onSelect={onPoiSelect}
      />
      {isFlyoverActive && <FlightPlaneLayer visualRef={visualRef} />}
      <PlaneHud
        isActive={isFlyoverActive}
        isPaused={isFlyoverPaused}
        altitudeMeters={altitudeMeters}
        speedMetersPerSecond={speedMetersPerSecond}
        latitude={latitude}
        longitude={longitude}
        isTutorialActive={isPlaneTutorialActive}
        isTutorialControlsStep={isPlaneTutorialControlsStep}
      />
      {isPlaneTutorialActive && (
        <PlaneTutorial
          onFinish={onFinishPlaneTutorial}
          onPause={onSetFlyoverPaused}
          onControlsStepChange={onPlaneTutorialControlsStepChange}
        />
      )}
      <ExploreMapTutorial isMapReady={isMapReady} />
      {children}
    </>
  )
}
