/**
 * File: OverlayScrollbar.tsx | Author: Chace Nielson
 * Created: 2026-10-23 | Updated: 2026-10-23
 * Description: Provide an accessible floating scrollbar without reserving layout width.
 * Dependencies: React, react-i18next, document scrolling APIs.
 */
import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent, PointerEvent } from 'react'
import { useTranslation } from 'react-i18next'

type ScrollMetrics = {
  scrollTop: number
  clientHeight: number
  scrollHeight: number
}

type DragStart = {
  pointerY: number
  scrollTop: number
}

function readScrollMetrics(): ScrollMetrics {
  const root = document.documentElement

  return {
    scrollTop: window.scrollY,
    clientHeight: root.clientHeight,
    scrollHeight: root.scrollHeight,
  }
}

export function OverlayScrollbar() {
  const { t } = useTranslation('global')
  const [metrics, setMetrics] = useState<ScrollMetrics>(readScrollMetrics)
  const scrollbarRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLSpanElement>(null)
  const dragStart = useRef<DragStart | null>(null)

  useEffect(() => {
    let animationFrame = 0
    const measure = () => {
      cancelAnimationFrame(animationFrame)
      animationFrame = requestAnimationFrame(() => {
        setMetrics(readScrollMetrics())
      })
    }
    const resizeObserver = new ResizeObserver(measure)

    window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    resizeObserver.observe(document.documentElement)
    resizeObserver.observe(document.body)
    measure()

    return () => {
      cancelAnimationFrame(animationFrame)
      window.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
      resizeObserver.disconnect()
    }
  }, [])

  const maxScroll = Math.max(0, metrics.scrollHeight - metrics.clientHeight)
  const trackHeight = Math.max(0, metrics.clientHeight - 8)

  if (maxScroll === 0 || trackHeight === 0) {
    return null
  }

  const thumbHeight = Math.min(
    trackHeight,
    Math.max(32, (metrics.clientHeight / metrics.scrollHeight) * trackHeight),
  )
  const maxThumbOffset = trackHeight - thumbHeight
  const scrollRatio = Math.min(1, Math.max(0, metrics.scrollTop / maxScroll))
  const thumbOffset = maxThumbOffset * scrollRatio
  const scrollPercent = Math.round(scrollRatio * 100)

  const scrollToPosition = (top: number) => {
    window.scrollTo({ top: Math.min(maxScroll, Math.max(0, top)) })
  }

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const scrollbar = scrollbarRef.current
    const isThumb = thumbRef.current?.contains(event.target as Node) ?? false

    if (!scrollbar) return

    if (isThumb) {
      event.preventDefault()
      dragStart.current = {
        pointerY: event.clientY,
        scrollTop: metrics.scrollTop,
      }
      scrollbar.setPointerCapture(event.pointerId)
      return
    }

    const bounds = scrollbar.getBoundingClientRect()
    const ratio = (event.clientY - bounds.top) / bounds.height
    scrollToPosition(ratio * maxScroll)
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragStart.current || maxThumbOffset === 0) return

    const thumbDelta = event.clientY - dragStart.current.pointerY
    scrollToPosition(
      dragStart.current.scrollTop + (thumbDelta / maxThumbOffset) * maxScroll,
    )
  }

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    dragStart.current = null

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const pageStep = metrics.clientHeight * 0.9
    const scrollSteps: Record<string, number> = {
      ArrowDown: 40,
      ArrowUp: -40,
      PageDown: pageStep,
      PageUp: -pageStep,
    }

    if (event.key in scrollSteps) {
      event.preventDefault()
      scrollToPosition(metrics.scrollTop + scrollSteps[event.key])
    } else if (event.key === 'Home') {
      event.preventDefault()
      scrollToPosition(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      scrollToPosition(maxScroll)
    }
  }

  return (
    <div
      ref={scrollbarRef}
      role="scrollbar"
      aria-label={t('scrollbar.label')}
      aria-controls="root"
      aria-orientation="vertical"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={scrollPercent}
      aria-valuetext={t('scrollbar.position', { percent: scrollPercent })}
      tabIndex={0}
      className="group fixed inset-y-1 right-0 z-60 w-4 touch-none cursor-pointer focus-visible:outline-2 focus-visible:outline-focus"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onKeyDown={handleKeyDown}
    >
      <span
        ref={thumbRef}
        aria-hidden="true"
        className="absolute top-0 right-1 w-1 rounded-full bg-muted/50 transition-colors group-hover:bg-pine/80 group-focus-visible:bg-pine motion-reduce:transition-none"
        style={{
          height: `${thumbHeight}px`,
          transform: `translateY(${thumbOffset}px)`,
        }}
      />
    </div>
  )
}
