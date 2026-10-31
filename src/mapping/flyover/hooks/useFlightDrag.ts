/**
  File: useFlightDrag.ts | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Steer by grabbing the map and dragging sideways, as well as with A and D.

  Usage:
  - Used by useFlyoverControls. The returned ref holds the steering from -1 to 1.

  Notes:
  - Dragging is measured from where the map was grabbed, so letting go flies straight.
  - Markers and map controls keep their own clicks; only empty map starts a drag.
 */
import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import type { MapRef } from 'react-map-gl/maplibre'
import {
  FLYOVER_DRAG_DEAD_ZONE,
  FLYOVER_DRAG_STEER_DISTANCE,
} from '../../map-settings/flyoverSettings'
import { clamp } from '../utils/flightMath'

type UseFlightDragOptions = {
  isActive: boolean
  mapRef: RefObject<MapRef | null>
}

const OWN_CLICK_SELECTOR =
  '.maplibregl-marker, .maplibregl-ctrl, button, a, input, select, textarea'

// Function: Turn a sideways drag distance into steering from -1 to 1.
function getSteering(distance: number) {
  const beyondDeadZone = Math.max(
    Math.abs(distance) - FLYOVER_DRAG_DEAD_ZONE,
    0,
  )
  return (
    Math.sign(distance) *
    clamp(
      beyondDeadZone / (FLYOVER_DRAG_STEER_DISTANCE - FLYOVER_DRAG_DEAD_ZONE),
      0,
      1,
    )
  )
}

// Function: Track steering from dragging the map while flyover mode is active.
export function useFlightDrag({ isActive, mapRef }: UseFlightDragOptions) {
  const turnRef = useRef(0)

  useEffect(() => {
    turnRef.current = 0
    if (!isActive) return

    const container = mapRef.current?.getMap().getCanvasContainer()
    if (!container) return

    let pointerId: number | null = null
    let startX = 0
    container.style.cursor = 'grab'
    container.style.touchAction = 'none'

    const handlePointerDown = (event: PointerEvent) => {
      if (
        pointerId !== null ||
        (event.pointerType === 'mouse' && event.button !== 0)
      ) {
        return
      }
      if (
        event.target instanceof Element &&
        event.target.closest(OWN_CLICK_SELECTOR)
      ) {
        return
      }

      pointerId = event.pointerId
      startX = event.clientX
      container.setPointerCapture(event.pointerId)
      container.style.cursor = 'grabbing'
    }
    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return

      turnRef.current = getSteering(event.clientX - startX)
    }
    const handlePointerEnd = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return

      pointerId = null
      turnRef.current = 0
      container.style.cursor = 'grab'
    }

    container.addEventListener('pointerdown', handlePointerDown)
    container.addEventListener('pointermove', handlePointerMove)
    container.addEventListener('pointerup', handlePointerEnd)
    container.addEventListener('pointercancel', handlePointerEnd)
    return () => {
      container.removeEventListener('pointerdown', handlePointerDown)
      container.removeEventListener('pointermove', handlePointerMove)
      container.removeEventListener('pointerup', handlePointerEnd)
      container.removeEventListener('pointercancel', handlePointerEnd)
      container.style.cursor = ''
      container.style.touchAction = ''
      turnRef.current = 0
    }
  }, [isActive, mapRef])

  return turnRef
}
