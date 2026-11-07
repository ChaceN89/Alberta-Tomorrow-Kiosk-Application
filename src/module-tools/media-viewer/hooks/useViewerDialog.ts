/**
  File: useViewerDialog.ts | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Apply viewer motion from its origin and lock scrolling while it is open.

  Usage:
  - Called by MediaViewerDialog, which attaches the returned ref to its panel.

  Notes:
  - The dialog's data-motion attribute selects the animations in MediaViewer.css, and
    --viewer-dx, --viewer-dy, and --viewer-scale place both animations' small end.
 */
import { useEffect, useRef } from 'react'
import type { MediaViewerContent, ViewerOrigin } from '../provider/types'
import { getCurrentOrigin, setOriginVars } from '../utils/viewerOrigin'

export function useViewerDialog(
  content: MediaViewerContent | null,
  origin: ViewerOrigin | null,
  isClosing: boolean,
) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current

    if (!dialog) return

    if (content) {
      setOriginVars(dialog, origin)
      dialog.dataset.motion = 'opening'
    } else {
      delete dialog.dataset.motion
    }
  }, [content, origin])

  useEffect(() => {
    const dialog = dialogRef.current

    if (!isClosing || !dialog) return

    // Closing returns to where the origin element is now, mirroring the opening.
    setOriginVars(dialog, getCurrentOrigin(origin))
    dialog.dataset.motion = 'closing'
  }, [isClosing, origin])

  useEffect(() => {
    if (!content) return

    const root = document.documentElement
    const previousOverflow = root.style.overflow
    root.style.overflow = 'hidden'

    return () => {
      root.style.overflow = previousOverflow
    }
  }, [content])

  return dialogRef
}
