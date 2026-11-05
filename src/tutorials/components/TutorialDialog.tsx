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
import {
  useEffect,
  useRef,
  type CSSProperties,
  type DialogHTMLAttributes,
  type ReactNode,
  type RefObject,
} from 'react'

type TutorialDialogProps = {
  children: ReactNode
  ariaLabelledBy: string
  ariaDescribedBy: string
  className: string
  style?: CSSProperties
  dialogRef?: RefObject<HTMLDialogElement | null>
  onCancel?: DialogHTMLAttributes<HTMLDialogElement>['onCancel']
}

export function TutorialDialog({
  children,
  ariaLabelledBy,
  ariaDescribedBy,
  className,
  style,
  dialogRef,
  onCancel,
}: TutorialDialogProps) {
  const internalDialogRef = useRef<HTMLDialogElement>(null)
  const activeDialogRef = dialogRef ?? internalDialogRef

  useEffect(() => {
    const dialog = activeDialogRef.current
    if (!dialog || dialog.open) return

    dialog.showModal()
    return () => {
      if (dialog.open) dialog.close()
    }
  }, [activeDialogRef])

  return (
    <dialog
      ref={activeDialogRef}
      className={className}
      style={style}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      onCancel={(event) => {
        event.preventDefault()
        onCancel?.(event)
      }}
    >
      {children}
    </dialog>
  )
}
