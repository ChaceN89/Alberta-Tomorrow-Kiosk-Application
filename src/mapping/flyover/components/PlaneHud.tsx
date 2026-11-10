/**
  File: PlaneHud.tsx | Author: Chace Nielson
  Date Created: Nov 5, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Keep map telemetry visible while limiting the controls panel to flyover mode.

  Usage:
  - Rendered by AlbertaMap for every flyover phase, including its exit transition.

  Notes:
  - Coordinates remain visible when flight altitude and speed are hidden.
 */
import { FlyoverControlPanel } from './FlyoverControlPanel'
import { FlyoverTelemetry } from './FlyoverTelemetry'
import { FlyoverPoiCompass } from './FlyoverPoiCompass'
import type { RefObject } from 'react'
import type { FlightState } from '../types'
import type { MapPoi } from '../../components/MapPoiMarker'

type PlaneHudProps = {
  isActive: boolean
  isFreeLooking: boolean
  altitudeMeters: number
  speedMetersPerSecond: number
  latitude: number
  longitude: number
  isTutorialActive: boolean
  isTutorialControlsStep: boolean
  activePoi?: MapPoi
  isCompassVisible: boolean
  flightPositionRef: RefObject<FlightState | null>
}

export function PlaneHud({
  isActive,
  isFreeLooking,
  altitudeMeters,
  speedMetersPerSecond,
  latitude,
  longitude,
  isTutorialActive,
  isTutorialControlsStep,
  activePoi,
  isCompassVisible,
  flightPositionRef,
}: PlaneHudProps) {
  return (
    <>
      {activePoi && (
        <FlyoverPoiCompass
          poi={activePoi}
          isVisible={isActive && isCompassVisible}
          flightPositionRef={flightPositionRef}
        />
      )}
      <FlyoverTelemetry
        isFlightActive={isActive}
        isFreeLooking={isFreeLooking}
        altitudeMeters={altitudeMeters}
        speedMetersPerSecond={speedMetersPerSecond}
        latitude={latitude}
        longitude={longitude}
      />
      <div
        className={`plane-hud ${isActive ? 'plane-hud--active' : ''}`}
        aria-hidden={!isActive}
        inert={!isActive}
      >
        <FlyoverControlPanel
          isTutorialActive={isTutorialActive}
          isTutorialControlsStep={isTutorialControlsStep}
        />
      </div>
    </>
  )
}
