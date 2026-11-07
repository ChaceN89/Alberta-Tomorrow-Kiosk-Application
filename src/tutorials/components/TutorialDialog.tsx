/**
  File: TutorialDialog.tsx | Author: Chace Nielson
  Date Created: Nov 5, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Present an accessible app-managed modal step for first-use tutorials.

  Usage:
  - Render while a tutorial step is active and provide its localized copy.

  Notes:
  - Escape skips the current tutorial step flow without entering the browser top layer.
 */
import {
  useRef,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from 'react'
import { useModalFocusTrap } from '@/components/overlays/useModalFocusTrap'

type TutorialDialogProps = {
  children: ReactNode
  ariaLabelledBy: string
  ariaDescribedBy: string
  className: string
  style?: CSSProperties
  dialogRef?: RefObject<HTMLDialogElement | null>
  onEscape?: () => void
}

export function TutorialDialog({
  children,
  ariaLabelledBy,
  ariaDescribedBy,
  className,
  style,
  dialogRef,
  onEscape,
}: TutorialDialogProps) {
  const internalDialogRef = useRef<HTMLDialogElement>(null)
  const activeDialogRef = dialogRef ?? internalDialogRef
  const isVisible = style?.visibility !== 'hidden'
  const isIntroDialog = className
    .split(/\s+/)
    .includes('tutorial-dialog--intro')

  useModalFocusTrap(activeDialogRef, isVisible)

  return (
    <>
      <div
        className={`tutorial-dialog-backdrop ${
          isIntroDialog ? 'tutorial-dialog-backdrop--intro' : ''
        }`}
        hidden={!isVisible}
        aria-hidden="true"
      />
      <dialog
        ref={activeDialogRef}
        open
        tabIndex={-1}
        aria-modal="true"
        className={className}
        style={style}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            event.preventDefault()
            onEscape?.()
          }
        }}
      >
        {children}
      </dialog>
    </>
  )
}
