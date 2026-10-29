/**
  File: useViewerDialog.ts | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Drive the viewer's native dialog: open from an origin, return to it on close, and lock scroll.

  Usage:
  - Called by MediaViewerDialog, which attaches the returned ref to its dialog.

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

    if (content && !dialog.open) {
      dialog.showModal()
      setOriginVars(dialog, origin)
      dialog.dataset.motion = 'opening'
    } else if (!content && dialog.open) {
      dialog.close()
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
