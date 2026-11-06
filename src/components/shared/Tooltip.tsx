/**
  File: Tooltip.tsx | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Show a delayed, viewport-aware tooltip when its control is hovered or focused.
  - Render in the document body so overflow and stacking contexts do not clip it.

  Usage:
  - Wrap an interactive element in <Tooltip text="...">...</Tooltip>.

  Notes:
  - The tooltip is also connected to the child with aria-describedby and works with keyboard focus.
  - Touch users retain the control; no hover interaction is required to use it.
 */
import { cloneElement, useEffect, useId, useRef, useState } from 'react'
import type { ReactElement } from 'react'
import { createPortal } from 'react-dom'

type TooltipProps = {
  text: string
  children: ReactElement<{ 'aria-describedby'?: string }>
  delay?: number
  placement?: 'top' | 'right'
}

export function Tooltip({
  text,
  children,
  delay = 850,
  placement = 'top',
}: TooltipProps) {
  const tooltipId = useId()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const anchorRef = useRef<HTMLSpanElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null)
  const [position, setPosition] = useState({ left: 0, top: 0 })

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    },
    [],
  )

  const showAfterDelay = () => {
    if (timerRef.current) clearTimeout(timerRef.current)

    timerRef.current = setTimeout(() => {
      const rect = anchorRef.current?.getBoundingClientRect()
      if (!rect) return

      setPosition({
        left:
          placement === 'right'
            ? rect.right + 8
            : Math.max(
                136,
                Math.min(rect.left + rect.width / 2, window.innerWidth - 136),
              ),
        top:
          placement === 'right'
            ? rect.top + rect.height / 2
            : Math.max(8, rect.top - 8),
      })
      setPortalTarget(
        anchorRef.current?.closest('dialog[open]') ?? document.body,
      )
      setIsVisible(true)
    }, delay)
  }

  const hide = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = null
    setIsVisible(false)
  }

  const child = cloneElement(children, {
    'aria-describedby': isVisible
      ? tooltipId
      : children.props['aria-describedby'],
  })

  return (
    <span
      ref={anchorRef}
      className="inline-flex"
      onMouseEnter={showAfterDelay}
      onMouseLeave={hide}
      onFocus={showAfterDelay}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) hide()
      }}
    >
      {child}
      {isVisible &&
        createPortal(
          <span
            id={tooltipId}
            role="tooltip"
            className={`pointer-events-none fixed z-(--z-tooltip) max-w-64 rounded-lg bg-ink px-3 py-2 text-center text-sm text-surface shadow-lg ${
              placement === 'right'
                ? '-translate-y-1/2'
                : '-translate-x-1/2 -translate-y-full'
            }`}
            style={{
              left: position.left,
              top: position.top,
              ...(placement === 'right'
                ? { maxWidth: 'min(16rem, calc(100vw - 3.5rem))' }
                : {}),
            }}
          >
            {text}
          </span>,
          portalTarget ?? document.body,
        )}
    </span>
  )
}
