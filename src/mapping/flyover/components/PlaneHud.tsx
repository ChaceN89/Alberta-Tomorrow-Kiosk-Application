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

type PlaneHudProps = {
  isActive: boolean
  isPaused: boolean
  altitudeMeters: number
  speedMetersPerSecond: number
  latitude: number
  longitude: number
  isTutorialActive: boolean
  isTutorialControlsStep: boolean
}

export function PlaneHud({
  isActive,
  isPaused,
  altitudeMeters,
  speedMetersPerSecond,
  latitude,
  longitude,
  isTutorialActive,
  isTutorialControlsStep,
}: PlaneHudProps) {
  return (
    <>
      <FlyoverTelemetry
        isFlightActive={isActive}
        isPaused={isPaused}
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
