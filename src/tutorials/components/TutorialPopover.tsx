/**
  File: TutorialPopover.tsx | Author: Chace Nielson
  Date Created: Nov 5, 2026
  Date Updated: Nov 5, 2026

  Description:
  - Share the accessible non-modal shell and directional arrow used by coach marks.

  Usage:
  - Render while a tutorial step is active and provide its measured position.

  Notes:
  - The non-modal shell leaves the page interactive unless a tutorial adds its own backdrop.
 */
import type { CSSProperties, ReactNode, RefObject } from 'react'
import type { TutorialPopoverPosition } from '../utils/tutorialPositioning'

type TutorialPopoverProps = {
  popupRef: RefObject<HTMLElement | null>
  titleId: string
  descriptionId: string
  position: TutorialPopoverPosition | null
  isVisible?: boolean
  unpositionedStyle?: CSSProperties
  className: string
  children: ReactNode
}

export function TutorialPopover({
  popupRef,
  titleId,
  descriptionId,
  position,
  isVisible = true,
  unpositionedStyle,
  className,
  children,
}: TutorialPopoverProps) {
  const arrowStyle =
    position?.arrow.side === 'top' || position?.arrow.side === 'bottom'
      ? { left: position.arrow.offset }
      : { top: position?.arrow.offset }

  return (
    <section
      ref={popupRef}
      role="dialog"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      style={{
        ...(position?.style ?? unpositionedStyle),
        visibility: isVisible ? 'visible' : 'hidden',
      }}
      className={className}
    >
      {position && (
        <span
          aria-hidden="true"
          className={`tutorial-popover__arrow tutorial-popover__arrow--${position.arrow.side}`}
          style={arrowStyle}
        />
      )}
      {children}
    </section>
  )
}
