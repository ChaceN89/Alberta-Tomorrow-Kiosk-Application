/**
  File: FlightPlaneLayer.tsx | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Load the plane overlay only when flyover mode needs it.

  Usage:
  - Rendered by AlbertaMap while flyover mode is active.

  Notes:
  - The overlay code is normally preloaded by useFlyoverControls.
 */
import { lazy, Suspense } from 'react'
import type { RefObject } from 'react'
import type { FlightVisualState } from '../types'
import { loadFlightPlaneOverlay } from '../utils/preloadFlightPlane'

const LazyFlightPlaneOverlay = lazy(() =>
  loadFlightPlaneOverlay().then((module) => ({
    default: module.FlightPlaneOverlay,
  })),
)

type FlightPlaneLayerProps = {
  visualRef: RefObject<FlightVisualState>
}

export function FlightPlaneLayer({ visualRef }: FlightPlaneLayerProps) {
  return (
    <Suspense fallback={null}>
      <LazyFlightPlaneOverlay visualRef={visualRef} />
    </Suspense>
  )
}
