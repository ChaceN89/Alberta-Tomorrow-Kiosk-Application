/**
  File: MediaViewerProvider.tsx | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Provide a shared, accessible popup for reading messages and viewing images.
  - Allow callers to grant progress when a viewer is opened.
  - Grow the viewer out of the clicked element and shrink it away when closed.

  Usage:
  - Wrap application routes in MediaViewerProvider and call useMediaViewer in a module.

  Notes:
  - The journal stays behind the viewer when both are requested.
  - Motion lives in MediaViewer.css; CLOSE_DURATION_MS must match its closing animation.
  - The dialog, its bodies, and the dialog behavior are in components/ and hooks/.
 */
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { MediaViewerDialog } from '../components/MediaViewerDialog'
import { MediaViewerContext } from './MediaViewerContext'
import type {
  ImageViewerContent,
  MediaViewerContent,
  MediaViewerOpenOptions,
  MessageViewerContent,
  ViewerOrigin,
} from './types'
import { measureOrigin } from '../utils/viewerOrigin'
import '@/styles/MediaViewer.css'

const CLOSE_DURATION_MS = 320

type MediaViewerProviderProps = {
  children: ReactNode
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function MediaViewerProvider({ children }: MediaViewerProviderProps) {
  const [content, setContent] = useState<MediaViewerContent | null>(null)
  const [origin, setOrigin] = useState<ViewerOrigin | null>(null)
  const [isClosing, setClosing] = useState(false)
  const closeTimerRef = useRef<number | null>(null)

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current === null) return

    window.clearTimeout(closeTimerRef.current)
    closeTimerRef.current = null
  }, [])

  const open = useCallback(
    (next: MediaViewerContent, options?: MediaViewerOpenOptions) => {
      clearCloseTimer()
      setClosing(false)
      options?.onOpen?.()
      setOrigin(options?.origin ? measureOrigin(options.origin) : null)
      setContent(next)
    },
    [clearCloseTimer],
  )

  const openMessage = useCallback(
    (message: MessageViewerContent, options?: MediaViewerOpenOptions) =>
      open({ type: 'message', ...message }, options),
    [open],
  )

  const openImage = useCallback(
    (image: ImageViewerContent, options?: MediaViewerOpenOptions) =>
      open({ type: 'image', ...image }, options),
    [open],
  )

  const finishClose = useCallback(() => {
    clearCloseTimer()
    setClosing(false)
    setContent(null)
  }, [clearCloseTimer])

  // Plays the closing animation first; the dialog is removed when it ends.
  const requestClose = useCallback(() => {
    if (closeTimerRef.current !== null) return

    if (prefersReducedMotion()) {
      finishClose()
      return
    }

    setClosing(true)
    closeTimerRef.current = window.setTimeout(finishClose, CLOSE_DURATION_MS)
  }, [finishClose])

  useEffect(() => clearCloseTimer, [clearCloseTimer])

  const value = useMemo(
    () => ({ isOpen: content !== null, openMessage, openImage }),
    [content, openImage, openMessage],
  )

  return (
    <MediaViewerContext.Provider value={value}>
      {children}
      <MediaViewerDialog
        content={content}
        origin={origin}
        isClosing={isClosing}
        onRequestClose={requestClose}
        onClosed={finishClose}
      />
    </MediaViewerContext.Provider>
  )
}
