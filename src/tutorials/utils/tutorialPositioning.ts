/**
  File: tutorialPositioning.ts | Author: Chace Nielson
  Date Created: Nov 5, 2026
  Date Updated: Nov 5, 2026

  Description:
  - Calculate clamped positions and arrow offsets for tutorial popovers.

  Usage:
  - Call after measuring an anchor and its tutorial popup.

  Notes:
  - Vertical and side placements share viewport margins but retain distinct layouts.
 */
import type { CSSProperties } from 'react'

type TargetRect = Pick<
  DOMRectReadOnly,
  'left' | 'top' | 'right' | 'bottom' | 'width' | 'height'
>
type PopupSize = Pick<DOMRectReadOnly, 'width' | 'height'>

export type TutorialPopoverPosition = {
  style: CSSProperties
  arrow: {
    side: 'top' | 'bottom' | 'left' | 'right'
    offset: number
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function getVerticalTutorialPosition(
  target: TargetRect,
  popup: PopupSize,
  placement: 'above' | 'below',
): TutorialPopoverPosition {
  const margin = 16
  const gap = 14
  const arrowInset = 28
  const center = target.left + target.width / 2
  const left = clamp(
    center - popup.width / 2,
    margin,
    window.innerWidth - popup.width - margin,
  )
  const roomAbove = target.top - gap - margin
  const roomBelow = window.innerHeight - target.bottom - gap - margin
  const placeAbove =
    placement === 'above'
      ? roomAbove >= popup.height || roomBelow < popup.height
      : roomBelow < popup.height && roomAbove >= popup.height
  const top = placeAbove
    ? Math.max(margin, target.top - gap - popup.height)
    : Math.min(target.bottom + gap, window.innerHeight - popup.height - margin)

  return {
    style: { inset: 'auto', margin: 0, left, top },
    arrow: {
      side: placeAbove ? 'bottom' : 'top',
      offset: clamp(center - left, arrowInset, popup.width - arrowInset),
    },
  }
}

export function getSideTutorialPosition(
  target: TargetRect,
  popup: PopupSize,
  obstructionLeft: number,
): TutorialPopoverPosition & { style: CSSProperties & { width: number } } {
  const margin = 16
  const gap = 14
  const arrowMargin = 24
  const availableRight = obstructionLeft - target.right - gap
  const placeRight = availableRight >= Math.min(popup.width, 280)
  const width = placeRight ? Math.min(popup.width, availableRight) : popup.width
  const left = placeRight
    ? target.right + gap
    : Math.max(margin, target.left - gap - width)
  const top = clamp(
    target.top + target.height / 2 - popup.height / 2,
    margin,
    window.innerHeight - popup.height - margin,
  )

  return {
    style: { inset: 'auto', margin: 0, left, top, width },
    arrow: {
      side: placeRight ? 'left' : 'right',
      offset: clamp(
        target.top + target.height / 2 - top,
        arrowMargin,
        popup.height - arrowMargin,
      ),
    },
  }
}
