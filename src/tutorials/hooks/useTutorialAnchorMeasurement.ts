/**
  File: useTutorialAnchorMeasurement.ts | Author: Chace Nielson
  Date Created: Nov 5, 2026
  Date Updated: Nov 5, 2026

  Description:
  - Measure a tutorial popup and its anchor as the page layout changes.

  Usage:
  - Supply an anchor key, selector, and popup ref to an anchored tutorial.

  Notes:
  - A layout key can follow transitions for a bounded time after a layout change.
 */
import { useEffect, useRef, useState, type RefObject } from 'react'

export type TutorialAnchorMeasurement = {
  anchor: string
  targetRect: DOMRect
  popupSize: Pick<DOMRectReadOnly, 'width' | 'height'>
  obstructionRect: DOMRect | null
}

type UseTutorialAnchorMeasurementOptions = {
  anchor: string | null
  selector: string | null
  popupRef: RefObject<HTMLElement | null>
  obstructionSelector?: string
  scrollTargetIntoView?: boolean
  layoutKey?: string | number | boolean | null
  followDurationMs?: number
}

function sameRect(first: DOMRect, second: DOMRect) {
  return (
    first.left === second.left &&
    first.top === second.top &&
    first.width === second.width &&
    first.height === second.height
  )
}

function sameSize(
  first: Pick<DOMRectReadOnly, 'width' | 'height'>,
  second: Pick<DOMRectReadOnly, 'width' | 'height'>,
) {
  return first.width === second.width && first.height === second.height
}

export function useTutorialAnchorMeasurement({
  anchor,
  selector,
  popupRef,
  obstructionSelector,
  scrollTargetIntoView = false,
  layoutKey,
  followDurationMs = 0,
}: UseTutorialAnchorMeasurementOptions) {
  const [measurement, setMeasurement] =
    useState<TutorialAnchorMeasurement | null>(null)
  const previousLayoutKey = useRef(layoutKey)

  useEffect(() => {
    if (!anchor || !selector) {
      previousLayoutKey.current = layoutKey
      return
    }

    let frameId = 0
    let transitionFrameId = 0
    const target = document.querySelector(selector)
    const targetTop = target?.getBoundingClientRect().top ?? 0

    if (
      scrollTargetIntoView &&
      target &&
      (targetTop < 0 || targetTop > window.innerHeight - 120)
    ) {
      target.scrollIntoView({ block: 'start' })
    }

    const measure = () => {
      const currentTarget = document.querySelector(selector)
      const popup = popupRef.current
      if (!currentTarget || !popup) return

      const targetRect = currentTarget.getBoundingClientRect()
      // Layout dimensions avoid transient scale transforms on entering popovers.
      const popupSize = { width: popup.offsetWidth, height: popup.offsetHeight }
      const obstructionRect = obstructionSelector
        ? (document
            .querySelector(obstructionSelector)
            ?.getBoundingClientRect() ?? null)
        : null
      setMeasurement((current) =>
        current?.anchor === anchor &&
        sameRect(current.targetRect, targetRect) &&
        sameSize(current.popupSize, popupSize) &&
        ((current.obstructionRect === null && obstructionRect === null) ||
          (current.obstructionRect !== null &&
            obstructionRect !== null &&
            sameRect(current.obstructionRect, obstructionRect)))
          ? current
          : { anchor, targetRect, popupSize, obstructionRect },
      )
    }
    const scheduleMeasure = () => {
      cancelAnimationFrame(frameId)
      frameId = requestAnimationFrame(measure)
    }

    const resizeObserver = new ResizeObserver(scheduleMeasure)
    const observedTarget = document.querySelector(selector)
    const observedPopup = popupRef.current
    const observedObstruction = obstructionSelector
      ? document.querySelector(obstructionSelector)
      : null
    if (observedTarget) resizeObserver.observe(observedTarget)
    if (observedPopup) resizeObserver.observe(observedPopup)
    if (observedObstruction) resizeObserver.observe(observedObstruction)

    const initialMeasure = window.setTimeout(() => {
      measure()
      frameId = requestAnimationFrame(measure)
    }, 0)
    window.addEventListener('resize', scheduleMeasure)
    window.addEventListener('scroll', scheduleMeasure, true)

    const shouldFollowLayout =
      previousLayoutKey.current !== layoutKey && followDurationMs > 0
    previousLayoutKey.current = layoutKey

    if (shouldFollowLayout) {
      const transitionEndsAt = performance.now() + followDurationMs
      const followTransition = () => {
        measure()
        if (performance.now() < transitionEndsAt) {
          transitionFrameId = requestAnimationFrame(followTransition)
        }
      }

      transitionFrameId = requestAnimationFrame(followTransition)
    }

    return () => {
      window.clearTimeout(initialMeasure)
      cancelAnimationFrame(frameId)
      cancelAnimationFrame(transitionFrameId)
      resizeObserver.disconnect()
      window.removeEventListener('resize', scheduleMeasure)
      window.removeEventListener('scroll', scheduleMeasure, true)
    }
  }, [
    anchor,
    followDurationMs,
    layoutKey,
    obstructionSelector,
    popupRef,
    scrollTargetIntoView,
    selector,
  ])

  return measurement?.anchor === anchor ? measurement : null
}
