/**
  File: MediaViewerDialog.tsx | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Render the viewer's modal dialog with its header and the image or message body.

  Usage:
  - Rendered once by MediaViewerProvider.

  Notes:
  - Escape and backdrop clicks ask the provider to close so the closing animation plays.
  - The native close event means the dialog is already gone, so it finishes immediately.
 */
import { useId } from 'react'
import { useViewerDialog } from '../hooks/useViewerDialog'
import type { MediaViewerContent, ViewerOrigin } from '../provider/types'
import { ImageViewerBody } from './ImageViewerBody'
import { MessageViewerBody } from './MessageViewerBody'
import { ViewerHeader } from './ViewerHeader'

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
          ) : (
            <ImageViewerBody content={content} />
          )}
        </div>
      )}
    </dialog>
  )
}
