/**
  File: TutorialDialog.tsx | Author: Chace Nielson
  Date Created: Nov 5, 2026
  Date Updated: Nov 5, 2026

  Description:
  - Present an accessible modal step for first-use tutorials.

  Usage:
  - Render while a tutorial step is active and provide its localized copy.

  Notes:
  - Escape skips the current tutorial step flow.
 */
import { useEffect, useId, useRef } from 'react'

type TutorialDialogProps = {
  title: string
  description: string
  actionLabel: string
  onAction: () => void
  stepLabel?: string
  skipLabel?: string
  onSkip?: () => void
}

export function TutorialDialog({
  title,
  description,
  actionLabel,
  onAction,
  stepLabel,
  skipLabel,
  onSkip,
}: TutorialDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog || dialog.open) return

    dialog.showModal()
    return () => {
      if (dialog.open) dialog.close()
    }
  }, [])

  return (
    <dialog
      ref={dialogRef}
      className="explore-tutorial-dialog"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => {
        event.preventDefault()
        ;(onSkip ?? onAction)()
      }}
    >
      <div className="explore-tutorial-dialog__content">
        {stepLabel && (
          <p className="text-sm font-semibold text-muted">{stepLabel}</p>
        )}
        <h2 id={titleId}>{title}</h2>
        <p id={descriptionId} className="text-muted">
          {description}
        </p>
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {onSkip && skipLabel ? (
            <button type="button" className="text-link" onClick={onSkip}>
              {skipLabel}
            </button>
          ) : (
            <span />
          )}
          <button type="button" className="button" onClick={onAction} autoFocus>
            {actionLabel}
          </button>
        </div>
      </div>
    </dialog>
  )
}
