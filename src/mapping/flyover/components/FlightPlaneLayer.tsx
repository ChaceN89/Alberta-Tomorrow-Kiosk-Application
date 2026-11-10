/**
  File: FlightPlaneLayer.tsx | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Load the plane overlay only when flyover mode needs it.

  Usage:
  - Rendered by AlbertaMap while flyover mode is active.

  Notes:
  - The overlay code is normally preloaded by useFlyoverControls.
 */
import { useEffect, useEffectEvent, useState } from 'react'
import type { RefObject } from 'react'
import type { FlightVisualState } from '../types'
import { loadFlightPlaneOverlay } from '../utils/preloadFlightPlane'

type FlightPlaneLayerProps = {
  visualRef: RefObject<FlightVisualState>
  onReady: () => void
  onError: (error: unknown) => void
}

export function FlightPlaneLayer({
  visualRef,
  onReady,
  onError,
}: FlightPlaneLayerProps) {
  const [loaded, setLoaded] = useState<Awaited<
    ReturnType<typeof loadFlightPlaneOverlay>
  > | null>(null)
  const notifyError = useEffectEvent((error: unknown) => onError(error))
  useEffect(() => {
    let active = true
    void loadFlightPlaneOverlay().then(
      (module) => {
        if (active) setLoaded(module)
      },
      (error: unknown) => {
        console.error('Unable to load the flyover plane overlay.', error)
        if (active) notifyError(error)
      },
    )
    return () => {
      active = false
    }
  }, [])
  if (!loaded) return null
  const Overlay = loaded.FlightPlaneOverlay
  return <Overlay visualRef={visualRef} onReady={onReady} onError={onError} />
}
