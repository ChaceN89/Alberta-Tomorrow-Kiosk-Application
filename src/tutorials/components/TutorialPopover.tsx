/**
  File: TutorialPopover.tsx | Author: Chace Nielson
  Date Created: Nov 5, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Share popup layout, optional modal behavior, positioning, and callout tail.

  Usage:
  - Render for any tutorial step; omit position for centered popups.

  Notes:
  - Modal popups use TutorialDialog without entering the browser top layer.
 */
import type { CSSProperties, ReactNode, RefObject } from 'react'
import { TutorialDialog } from './TutorialDialog'
import type { TutorialPopoverPosition } from '../utils/tutorialPositioning'

type TutorialPopoverBaseProps = {
  titleId: string
  descriptionId: string
  position?: TutorialPopoverPosition | null
  showTail?: boolean
  isVisible?: boolean
  unpositionedStyle?: CSSProperties
  className?: string
  children: ReactNode
}

type TutorialPopoverProps = TutorialPopoverBaseProps &
  (
    | {
        modal: true
        popupRef?: RefObject<HTMLDialogElement | null>
        onEscape?: () => void
      }
    | {
        modal?: false
        popupRef?: RefObject<HTMLElement | null>
        onEscape?: never
      }
  )

export function TutorialPopover({
  popupRef,
  titleId,
  descriptionId,
  position,
  showTail = true,
  isVisible = true,
  unpositionedStyle,
  className = '',
  children,
  modal,
  onEscape,
}: TutorialPopoverProps) {
  const arrowStyle = position
    ? position.arrow.side === 'top' || position.arrow.side === 'bottom'
      ? { left: position.arrow.offset - 8 }
      : { top: position.arrow.offset }
    : undefined
  const style = {
    ...(position?.style ?? unpositionedStyle),
    visibility: isVisible ? 'visible' : 'hidden',
  } satisfies CSSProperties
  const popupClassName = [
    'tutorial-step-popup',
    modal ? 'tutorial-dialog' : 'tutorial-popover',
    className,
    isVisible ? 'tutorial-popup--visible' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const content = (
    <>
      {position && showTail && (
        <span
          aria-hidden="true"
          className={`tutorial-popover__arrow tutorial-popover__arrow--${position.arrow.side}`}
          style={arrowStyle}
        />
      )}
      <div className="tutorial-popover__content">{children}</div>
    </>
  )

  if (modal) {
    return (
      <TutorialDialog
        dialogRef={popupRef}
        ariaLabelledBy={titleId}
        ariaDescribedBy={descriptionId}
        style={style}
        className={popupClassName}
        onEscape={onEscape}
      >
        {content}
      </TutorialDialog>
    )
  }

  return (
    <section
      ref={popupRef}
      role="dialog"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      style={style}
      className={popupClassName}
    >
      {content}
    </section>
  )
}
