/**
  File: MessageViewerBody.tsx | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Show a message with an optional subtitle, centered in the dialog.

  Usage:
  - Rendered by MediaViewerDialog for message content.

  Notes:
  - Line breaks in the message are kept, so short lists can be written as lines.
 */
import type { MessageViewerContent } from '../provider/types'

type MessageViewerBodyProps = {
  content: MessageViewerContent
}

export function MessageViewerBody({ content }: MessageViewerBodyProps) {
  return (
    <div className="flex flex-1 items-center justify-center overflow-y-auto p-6 md:p-12">
      <article className="w-full max-w-3xl space-y-5">
        {content.subtitle && (
          <p className="text-lg font-semibold text-pine">{content.subtitle}</p>
        )}
        <p className="whitespace-pre-line text-xl leading-relaxed md:text-2xl">
          {content.message}
        </p>
      </article>
    </div>
  )
}
