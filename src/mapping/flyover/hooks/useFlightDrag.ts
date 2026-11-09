/**
  File: useFlightDrag.ts | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Share orbit and zoom input between held right-click and active POI visits.

  Usage:
  - Used by useFlyoverControls; refs hold continuous input, state labels free look.

  Notes:
  - POI visits retain orbit input on release; closing restores the previous lens.
  - Only empty map accepts gestures. Capture loss and blur release held inputs.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import type { MapRef } from 'react-map-gl/maplibre'
import {
  FLYOVER_DRAG_DEAD_ZONE,
  FLYOVER_DRAG_STEER_DISTANCE,
  FLYOVER_FOV_DEFAULT,
  FLYOVER_FOV_ZOOM_IN,
  FLYOVER_FOV_ZOOM_OUT,
  FLYOVER_LOOK_SENSITIVITY,
  FLYOVER_WHEEL_SENSITIVITY,
} from '../../map-settings/flyoverSettings'
import { clamp, shortestAngleDelta } from '../utils/flightMath'
import { FLIGHT_ORBIT_CAMERA_PITCH } from '../utils/flightCamera'

const OWN_CLICK_SELECTOR =
  '.maplibregl-marker, .maplibregl-ctrl, button, a, input, select, textarea'

export function useFlightDrag({
  isActive,
  mapRef,
  viewRef,
}: {
  isActive: boolean
  mapRef: RefObject<MapRef | null>
  viewRef: RefObject<{ yaw: number; pitch: number; fov: number }>
}) {
  const inputRef = useRef({
    turn: 0,
    climb: 0,
    isLooking: false,
    isPoiLooking: false,
    yaw: 0,
    pitch: 0,
    fov: FLYOVER_FOV_DEFAULT,
  })
  const [isFreeLooking, setIsFreeLooking] = useState(false)
  const [isPoiFreeLooking, setIsPoiFreeLooking] = useState(false)
  const poiViewRef = useRef<{ previousFov: number } | null>(null)
  const enterPoiLook = useCallback(
    (yaw: number, pitch: number, fov: number) => {
      const input = inputRef.current
      poiViewRef.current ??= { previousFov: input.fov }
      input.yaw = yaw
      input.pitch = pitch
      input.turn = input.climb = 0
      input.isPoiLooking = true
      input.fov = fov
      setIsPoiFreeLooking(true)
    },
    [],
  )
  const clearPoiLook = useCallback(() => {
    const previous = poiViewRef.current
    if (!previous) return
    poiViewRef.current = null
    const input = inputRef.current
    input.isPoiLooking = false
    if (!input.isLooking) {
      input.yaw = input.pitch = 0
      input.fov = previous.previousFov
    }
    setIsPoiFreeLooking(false)
  }, [])

  useEffect(() => {
    const input = inputRef.current
    Object.assign(input, {
      turn: 0,
      climb: 0,
      isLooking: false,
      isPoiLooking: false,
      yaw: 0,
      pitch: 0,
      fov: FLYOVER_FOV_DEFAULT,
    })
    if (!isActive) return
    const container = mapRef.current?.getMap().getCanvasContainer()
    if (!container) return
    let pointerId: number | null = null
    let startX = 0
    let startY = 0
    let lastX = 0
    let lastY = 0
    const previousCursor = container.style.cursor
    const previousTouchAction = container.style.touchAction
    container.style.cursor = 'grab'
    container.style.touchAction = 'none'
    const release = () => {
      const captured = pointerId
      pointerId = null
      input.turn = input.climb = 0
      input.isLooking = false
      if (!poiViewRef.current) {
        input.yaw = input.pitch = 0
      }
      setIsFreeLooking(false)
      if (captured !== null && container.hasPointerCapture(captured))
        container.releasePointerCapture(captured)
      container.style.cursor = 'grab'
    }
    const steering = (distance: number) =>
      Math.sign(distance) *
      clamp(
        (Math.abs(distance) - FLYOVER_DRAG_DEAD_ZONE) /
          (FLYOVER_DRAG_STEER_DISTANCE - FLYOVER_DRAG_DEAD_ZONE),
        0,
        1,
      )
    const down = (event: PointerEvent) => {
      if (
        pointerId !== null ||
        (event.button !== 0 && event.button !== 2) ||
        (event.target instanceof Element &&
          event.target.closest(OWN_CLICK_SELECTOR))
      )
        return
      pointerId = event.pointerId
      startX = lastX = event.clientX
      startY = lastY = event.clientY
      input.isLooking = event.pointerType === 'mouse' && event.button === 2
      if (input.isLooking || poiViewRef.current) {
        input.yaw = viewRef.current.yaw
        input.pitch = viewRef.current.pitch
      }
      setIsFreeLooking(input.isLooking)
      container.setPointerCapture(pointerId)
      container.style.cursor =
        input.isLooking || poiViewRef.current ? 'move' : 'grabbing'
      event.preventDefault()
    }
    const move = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return
      if (input.isLooking || poiViewRef.current) {
        input.yaw = shortestAngleDelta(
          0,
          input.yaw + (event.clientX - lastX) * FLYOVER_LOOK_SENSITIVITY,
        )
        input.pitch = clamp(
          input.pitch - (event.clientY - lastY) * FLYOVER_LOOK_SENSITIVITY,
          5 - FLIGHT_ORBIT_CAMERA_PITCH,
          89 - FLIGHT_ORBIT_CAMERA_PITCH,
        )
      } else {
        input.turn = steering(event.clientX - startX)
        input.climb = steering(startY - event.clientY)
      }
      lastX = event.clientX
      lastY = event.clientY
    }
    const up = (event: PointerEvent) => {
      if (event.pointerId === pointerId) release()
    }
    const wheel = (event: WheelEvent) => {
      if (
        event.target instanceof Element &&
        event.target.closest(OWN_CLICK_SELECTOR)
      )
        return
      event.preventDefault()
      const pixels =
        event.deltaY *
        (event.deltaMode === 1
          ? 16
          : event.deltaMode === 2
            ? container.clientHeight
            : 1)
      input.fov = clamp(
        input.fov + pixels * FLYOVER_WHEEL_SENSITIVITY,
        FLYOVER_FOV_ZOOM_IN,
        FLYOVER_FOV_ZOOM_OUT,
      )
    }
    const contextMenu = (event: MouseEvent) => {
      if (!(
        event.target instanceof Element &&
        event.target.closest(OWN_CLICK_SELECTOR)
      ))
        event.preventDefault()
    }
    container.addEventListener('pointerdown', down)
    container.addEventListener('pointermove', move)
    container.addEventListener('pointerup', up)
    container.addEventListener('pointercancel', up)
    container.addEventListener('lostpointercapture', up)
    container.addEventListener('contextmenu', contextMenu)
    container.addEventListener('wheel', wheel, { passive: false })
    window.addEventListener('blur', release)
    return () => {
      container.removeEventListener('pointerdown', down)
      container.removeEventListener('pointermove', move)
      container.removeEventListener('pointerup', up)
      container.removeEventListener('pointercancel', up)
      container.removeEventListener('lostpointercapture', up)
      container.removeEventListener('contextmenu', contextMenu)
      container.removeEventListener('wheel', wheel)
      window.removeEventListener('blur', release)
      poiViewRef.current = null
      setIsPoiFreeLooking(false)
      release()
      container.style.cursor = previousCursor
      container.style.touchAction = previousTouchAction
    }
  }, [isActive, mapRef, viewRef])

  return {
    inputRef,
    isFreeLooking: isFreeLooking || isPoiFreeLooking,
    enterPoiLook,
    clearPoiLook,
  }
}
