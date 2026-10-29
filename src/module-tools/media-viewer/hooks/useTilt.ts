/**
  File: useTilt.ts | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Tilt a surface (a photo or a note) in 3D toward where it is pressed, and spring it
    back on release.

  Usage:
  - TiltStage attaches the returned refs and pointer handlers.

  Notes:
  - Pointer position is written to CSS variables on the surface (--tilt-nx, --tilt-ny,
    --glare-x, --glare-y) instead of React state, so dragging never re-renders.
  - The pointer is measured against the untilted stage, because the surface's own box
    changes shape as it tilts.
  - Does nothing when the learner prefers reduced motion.
 */
import { useRef, type PointerEvent } from 'react'

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function useTilt() {
  const stageRef = useRef<HTMLDivElement>(null)
  const surfaceRef = useRef<HTMLDivElement>(null)
  const isPressedRef = useRef(false)

  const follow = (event: PointerEvent<HTMLDivElement>) => {
    const stage = stageRef.current
    const surface = surfaceRef.current

    if (!stage || !surface) return

    const rect = stage.getBoundingClientRect()
    const nx = clamp(
      (event.clientX - (rect.left + rect.width / 2)) /
        (surface.offsetWidth / 2),
      -1,
      1,
    )
    const ny = clamp(
      (event.clientY - (rect.top + rect.height / 2)) /
        (surface.offsetHeight / 2),
      -1,
      1,
    )

    surface.style.setProperty('--tilt-nx', nx.toFixed(3))
    surface.style.setProperty('--tilt-ny', ny.toFixed(3))
    surface.style.setProperty('--glare-x', `${((nx + 1) * 50).toFixed(1)}%`)
    surface.style.setProperty('--glare-y', `${((ny + 1) * 50).toFixed(1)}%`)
  }

  const release = () => {
    const surface = surfaceRef.current

    isPressedRef.current = false

    if (!surface) return

    surface.dataset.pressed = 'false'
    surface.style.setProperty('--tilt-nx', '0')
    surface.style.setProperty('--tilt-ny', '0')
  }

  const handlers = {
    onPointerDown: (event: PointerEvent<HTMLDivElement>) => {
      if (
        (event.pointerType === 'mouse' && event.button !== 0) ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ) {
        return
      }

      event.currentTarget.setPointerCapture(event.pointerId)
      isPressedRef.current = true
      event.currentTarget.dataset.pressed = 'true'
      follow(event)
    },
    onPointerMove: (event: PointerEvent<HTMLDivElement>) => {
      if (isPressedRef.current) follow(event)
    },
    onPointerUp: release,
    onPointerCancel: release,
    onLostPointerCapture: release,
  }

  return { stageRef, surfaceRef, handlers }
}
