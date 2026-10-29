/**
  File: MediaViewerProvider.tsx | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Provide a shared, accessible popup for reading messages and viewing images.
  - Allow callers to grant progress when a viewer is opened.

  Usage:
  - Wrap application routes in MediaViewerProvider and call useMediaViewer in a module.

  Notes:
  - The journal stays behind the viewer when both are requested.
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
  MessageViewerContent,
} from './types'
import { MediaViewerContext } from './MediaViewerContext'

type MediaViewerProviderProps = {
  children: ReactNode
}

export function MediaViewerProvider({ children }: MediaViewerProviderProps) {
  const [content, setContent] = useState<MediaViewerContent | null>(null)

  const openMessage = useCallback(
    (message: MessageViewerContent, onOpen?: () => void) => {
      onOpen?.()
      setContent({ type: 'message', ...message })
    },
    [],
  )

  const openImage = useCallback(
    (image: ImageViewerContent, onOpen?: () => void) => {
      onOpen?.()
      setContent({ type: 'image', ...image })
    },
    [],
  )

  const closeViewer = useCallback(() => setContent(null), [])
  const value = useMemo(
    () => ({ isOpen: content !== null, openMessage, openImage }),
    [content, openImage, openMessage],
  )

  return (
    <MediaViewerContext.Provider value={value}>
      {children}
      <MediaViewerDialog content={content} onClose={closeViewer} />
    </MediaViewerContext.Provider>
  )
}

type MediaViewerDialogProps = {
  content: MediaViewerContent | null
  onClose: () => void
}

function MediaViewerDialog({ content, onClose }: MediaViewerDialogProps) {
  const { t } = useTranslation('moduleTools')
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current

    if (!dialog) return

    if (content && !dialog.open) {
      dialog.showModal()
    } else if (!content && dialog.open) {
      dialog.close()
    }
  }, [content])

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
      className="m-auto h-[min(90dvh,48rem)] w-[min(72rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-line bg-surface p-0 text-ink shadow-2xl backdrop:bg-ink/50 backdrop:backdrop-blur-sm"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
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
              onClick={onClose}
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
