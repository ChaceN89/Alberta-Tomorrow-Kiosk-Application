/**
  File: viewerOrigin.ts | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Measure the element a viewer opens from and place the dialog's animations on it.

  Usage:
  - measureOrigin runs when the viewer opens; setOriginVars runs on open and again on close.

  Notes:
  - The origin keeps its element so closing can return to where the element is now,
    for example after the journal scrolled.
  - --viewer-dx, --viewer-dy, and --viewer-scale are read by MediaViewer.css.
 */
import type { ViewerOrigin } from '../provider/types'

const MIN_ORIGIN_SCALE = 0.02
const MAX_ORIGIN_SCALE = 0.2
// The popout starts at half the size of the element it grows from.
const ORIGIN_SIZE_FACTOR = 0.5
const FALLBACK_ORIGIN_SCALE = 0.85

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function measureOrigin(element: Element): ViewerOrigin {
  const rect = element.getBoundingClientRect()

  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
    width: rect.width,
    height: rect.height,
    element,
  }
}

// Prefers where the element is now; falls back to where it was when the viewer opened.
export function getCurrentOrigin(origin: ViewerOrigin | null) {
  if (!origin?.element?.isConnected) return origin

  const current = measureOrigin(origin.element)

  return current.width > 0 && current.height > 0 ? current : origin
}

export function setOriginVars(
  dialog: HTMLDialogElement,
  origin: ViewerOrigin | null,
) {
  const rect = dialog.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  const scale = origin
    ? clamp(
        Math.min(origin.width / rect.width, origin.height / rect.height) *
          ORIGIN_SIZE_FACTOR,
        MIN_ORIGIN_SCALE,
        MAX_ORIGIN_SCALE,
      )
    : FALLBACK_ORIGIN_SCALE

  dialog.style.setProperty(
    '--viewer-dx',
    `${(origin?.x ?? centerX) - centerX}px`,
  )
  dialog.style.setProperty(
    '--viewer-dy',
    `${(origin?.y ?? centerY) - centerY}px`,
  )
  dialog.style.setProperty('--viewer-scale', String(scale))
}
