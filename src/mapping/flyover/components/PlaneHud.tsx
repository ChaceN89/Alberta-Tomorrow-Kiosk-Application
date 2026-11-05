/**
  File: PlaneHud.tsx | Author: Chace Nielson
  Date Created: Nov 5, 2026
  Date Updated: Nov 5, 2026

  Description:
  - Group flight telemetry and controls into a HUD that fades with flyover mode.

  Usage:
  - Rendered by AlbertaMap for every flyover phase, including its exit transition.

  Notes:
  - The POI selector remains map-owned so it stays available outside flyover mode.
 */
import { FlyoverControlPanel } from './FlyoverControlPanel'
import { FlyoverTelemetry } from './FlyoverTelemetry'

type PlaneHudProps = {
  isActive: boolean
  isPaused: boolean
  altitudeMeters: number
  speedMetersPerSecond: number
  isTutorialActive: boolean
  isTutorialControlsStep: boolean
}

export function PlaneHud({
  isActive,
  isPaused,
  altitudeMeters,
  speedMetersPerSecond,
  isTutorialActive,
  isTutorialControlsStep,
}: PlaneHudProps) {
  return (
    <div
      className={`plane-hud ${isActive ? 'plane-hud--active' : ''}`}
      aria-hidden={!isActive}
      inert={!isActive}
    >
      <FlyoverTelemetry
        altitudeMeters={altitudeMeters}
        speedMetersPerSecond={speedMetersPerSecond}
      />
      <FlyoverControlPanel
        isPaused={isPaused}
        isTutorialActive={isTutorialActive}
        isTutorialControlsStep={isTutorialControlsStep}
      />
    </div>
  )
}
