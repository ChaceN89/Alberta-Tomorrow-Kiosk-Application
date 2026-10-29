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
 */
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useTranslation } from 'react-i18next'
import type {
  MediaViewerContent,
  ImageViewerContent,
  MediaViewerOpenOptions,
  MessageViewerContent,
} from './types'
import { MediaViewerContext } from './MediaViewerContext'
import '@/styles/MediaViewer.css'

const CLOSE_DURATION_MS = 520
const MIN_ORIGIN_SCALE = 0.05
const MAX_ORIGIN_SCALE = 0.4
const FALLBACK_ORIGIN_SCALE = 0.85

type ViewerOrigin = {
  x: number
  y: number
  width: number
  height: number
}

type MediaViewerProviderProps = {
  children: ReactNode
}

function measureOrigin(element: Element): ViewerOrigin {
  const rect = element.getBoundingClientRect()

  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
    width: rect.width,
    height: rect.height,
  }
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

type MediaViewerDialogProps = {
  content: MediaViewerContent | null
  origin: ViewerOrigin | null
  isClosing: boolean
  onRequestClose: () => void
  onClosed: () => void
}

// Offsets the opening animation so the dialog starts small, on top of the origin.
function setOpeningOrigin(
  dialog: HTMLDialogElement,
  origin: ViewerOrigin | null,
) {
  const rect = dialog.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  const scale = origin
    ? Math.min(
        Math.max(
          Math.min(origin.width / rect.width, origin.height / rect.height),
          MIN_ORIGIN_SCALE,
        ),
        MAX_ORIGIN_SCALE,
      )
    : FALLBACK_ORIGIN_SCALE

  dialog.style.setProperty(
    '--viewer-dx',
    `${(origin?.x ?? centerX) - centerX}px`,
  )
  dialog.style.setProperty(
    '--viewer-dy',
    `${(origin?.y ?? centerY) - centerY}px`,
  )
  dialog.style.setProperty('--viewer-scale', String(scale))
}

function MediaViewerDialog({
  content,
  origin,
  isClosing,
  onRequestClose,
  onClosed,
}: MediaViewerDialogProps) {
  const { t } = useTranslation('moduleTools')
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current

    if (!dialog) return

    if (content && !dialog.open) {
      dialog.showModal()
      setOpeningOrigin(dialog, origin)
      dialog.dataset.motion = 'opening'
    } else if (!content && dialog.open) {
      dialog.close()
      delete dialog.dataset.motion
    }
  }, [content, origin])

  useEffect(() => {
    if (isClosing && dialogRef.current) {
      dialogRef.current.dataset.motion = 'closing'
    }
  }, [isClosing])

  useEffect(() => {
    if (!content) return

    const root = document.documentElement
    const previousOverflow = root.style.overflow
    root.style.overflow = 'hidden'

    return () => {
      root.style.overflow = previousOverflow
    }
  }, [content])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className="media-viewer m-auto h-[min(90dvh,48rem)] w-[min(72rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-line bg-surface p-0 text-ink shadow-2xl backdrop:bg-ink/50 backdrop:backdrop-blur-sm"
      onCancel={(event) => {
        event.preventDefault()
        onRequestClose()
      }}
      onClose={onClosed}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onRequestClose()
        }
      }}
    >
      {content && (
        <div className="flex h-full flex-col">
          <header className="flex shrink-0 items-center justify-between gap-4 border-b border-line p-4 md:px-6">
            <h2 id={titleId} className="text-xl">
              {content.title}
            </h2>
            <button
              type="button"
              className="flex size-12 shrink-0 items-center justify-center rounded-xl text-2xl text-muted hover:bg-canvas"
              aria-label={t('mediaViewer.close')}
              onClick={onRequestClose}
            >
              <span aria-hidden="true">×</span>
            </button>
          </header>
          {content.type === 'message' ? (
            <div className="flex flex-1 items-center justify-center overflow-y-auto p-6 md:p-12">
              <article className="w-full max-w-3xl space-y-5">
                {content.subtitle && (
                  <p className="text-lg font-semibold text-pine">
                    {content.subtitle}
                  </p>
                )}
                <p className="whitespace-pre-line text-xl leading-relaxed md:text-2xl">
                  {content.message}
                </p>
              </article>
            </div>
          ) : (
            <div className="grid min-h-0 flex-1 grid-cols-1 overflow-y-auto md:grid-cols-[minmax(0,1.7fr)_minmax(16rem,1fr)]">
              <div className="flex min-h-64 items-center justify-center bg-canvas p-4 md:min-h-0">
                <img
                  src={content.src}
                  alt={content.alt}
                  className="max-h-[55dvh] max-w-full object-contain md:max-h-full"
                />
              </div>
              <div className="space-y-4 p-6 md:overflow-y-auto md:p-8">
                <h3 className="text-xl font-semibold">{content.title}</h3>
                <p className="text-muted">{content.description}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </dialog>
  )
}
