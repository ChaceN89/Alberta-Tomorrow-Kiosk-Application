/**
  File: MediaViewerDialog.tsx | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Render the viewer overlay with a shared header and the selected media body.

  Usage:
  - Rendered once by MediaViewerProvider.

  Notes:
  - Escape and backdrop clicks ask the provider to close so the closing animation plays.
 */
import { lazy, Suspense, useId } from 'react'
import { useTranslation } from 'react-i18next'
import { useAudioPlayer } from '@/module-tools/media-player/hooks/useAudioPlayer'
import { useModalFocusTrap } from '@/components/overlays/useModalFocusTrap'
import { useViewerDialog } from '../hooks/useViewerDialog'
import type { MediaViewerContent, ViewerOrigin } from '../provider/types'
import { ImageViewerBody } from './ImageViewerBody'
import { MessageViewerBody } from './MessageViewerBody'
import { ViewerHeader } from './ViewerHeader'

const ModelViewerBody = lazy(() =>
  import('./ModelViewerBody').then((module) => ({
    default: module.ModelViewerBody,
  })),
)

type MediaViewerDialogProps = {
  content: MediaViewerContent | null
  origin: ViewerOrigin | null
  isClosing: boolean
  onRequestClose: () => void
}

export function MediaViewerDialog({
  content,
  origin,
  isClosing,
  onRequestClose,
}: MediaViewerDialogProps) {
  const { t } = useTranslation('moduleTools')
  const { isFullscreen: isPlayerFullscreen } = useAudioPlayer()
  const titleId = useId()
  const dialogRef = useViewerDialog(content, origin, isClosing)
  useModalFocusTrap(dialogRef, content !== null && !isPlayerFullscreen)

  return (
    <div
      className="media-viewer-backdrop"
      data-motion={content ? (isClosing ? 'closing' : 'opening') : undefined}
      hidden={!content}
      inert={!content || isPlayerFullscreen}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onRequestClose()
        }
      }}
    >
      <dialog
        ref={dialogRef}
        open={content !== null}
        tabIndex={-1}
        aria-modal={content !== null && !isPlayerFullscreen ? true : undefined}
        aria-labelledby={titleId}
        className="media-viewer h-[min(92dvh,56rem)] w-[min(80rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-line bg-surface p-0 text-ink shadow-2xl"
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            event.preventDefault()
            onRequestClose()
          }
        }}
      >
        {content && (
          <div className="flex h-full flex-col">
            <ViewerHeader
              title={content.title}
              titleId={titleId}
              onClose={onRequestClose}
            />
            {content.type === 'message' ? (
              <MessageViewerBody content={content} />
            ) : content.type === 'image' ? (
              <ImageViewerBody content={content} />
            ) : (
              <Suspense
                fallback={
                  <p role="status" className="p-6 text-center text-muted">
                    {t('mediaViewer.modelLoading')}
                  </p>
                }
              >
                <ModelViewerBody content={content} />
              </Suspense>
            )}
          </div>
        )}
      </dialog>
    </div>
  )
}
