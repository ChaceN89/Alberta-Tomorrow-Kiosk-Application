/**
  File: MediaViewerDialog.tsx | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Render the viewer dialog with a shared header and the selected media body.

  Usage:
  - Rendered once by MediaViewerProvider.

  Notes:
  - Escape and backdrop clicks ask the provider to close so the closing animation plays.
  - The native close event means the dialog is already gone, so it finishes immediately.
 */
import { lazy, Suspense, useId } from 'react'
import { useTranslation } from 'react-i18next'
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
  onClosed: () => void
}

export function MediaViewerDialog({
  content,
  origin,
  isClosing,
  onRequestClose,
  onClosed,
}: MediaViewerDialogProps) {
  const { t } = useTranslation('moduleTools')
  const titleId = useId()
  const dialogRef = useViewerDialog(content, origin, isClosing)

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className="media-viewer m-auto h-[min(92dvh,56rem)] w-[min(80rem,calc(100vw-2rem))] max-w-none overflow-hidden rounded-2xl border border-line bg-surface p-0 text-ink shadow-2xl backdrop:bg-ink/50 backdrop:backdrop-blur-sm"
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
  )
}
