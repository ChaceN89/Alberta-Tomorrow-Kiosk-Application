/**
  File: useFullscreenScrollLock.ts | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Stop the page behind the full screen player from scrolling.

  Usage:
  - Called by the player panel with whether it is full screen.

  Notes:
  - Restores the previous overflow values when the lock ends.
 */
import { useEffect } from 'react'

export function useFullscreenScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return

    const root = document.documentElement
    const body = document.body
    const previousRootOverflow = root.style.overflow
    const previousBodyOverflow = body.style.overflow

    root.style.overflow = 'hidden'
    body.style.overflow = 'hidden'

    return () => {
      root.style.overflow = previousRootOverflow
      body.style.overflow = previousBodyOverflow
    }
  }, [isLocked])
}
