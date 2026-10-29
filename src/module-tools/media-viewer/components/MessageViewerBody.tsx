/**
  File: MessageViewerBody.tsx | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Show a message with an optional subtitle on a paper note that tilts in 3D when pressed.

  Usage:
  - Rendered by MediaViewerDialog for message content.

  Notes:
  - Line breaks in the message are kept, so short lists can be written as lines.
  - Optional images are drawn small and side by side at the bottom, like doodles on the note.
  - A note taller than the viewer scrolls inside; on touch screens it then pans vertically
    instead of tilting so it stays readable.
 */
import { useLayoutEffect, useRef, useState } from 'react'
import type { MessageViewerContent } from '../provider/types'
import { TiltStage } from './TiltStage'

type MessageViewerBodyProps = {
  content: MessageViewerContent
}

export function MessageViewerBody({ content }: MessageViewerBodyProps) {
  const bodyRef = useRef<HTMLElement>(null)
  const [isScrollable, setScrollable] = useState(false)

  useLayoutEffect(() => {
    const element = bodyRef.current

    if (!element) return

    const measure = () =>
      setScrollable(element.scrollHeight > element.clientHeight + 1)
    const observer = new ResizeObserver(measure)

    measure()
    observer.observe(element)
    return () => observer.disconnect()
  }, [content])

  return (
    <TiltStage
      surfaceClassName={`media-viewer-note ${
        isScrollable ? 'media-viewer-note--scrollable' : ''
      }`}
    >
      <article
        ref={bodyRef}
        className="media-viewer-note__body space-y-5 px-10 pt-10 pb-16 md:px-14 md:pt-14 md:pb-24"
      >
        {content.subtitle && (
          <p className="text-lg font-semibold text-pine">{content.subtitle}</p>
        )}
        <p className="whitespace-pre-line text-xl leading-relaxed md:text-2xl">
          {content.message}
        </p>
        {content.images && content.images.length > 0 && (
          <div className="media-viewer-note__doodles">
            {content.images.map((image) => (
              <img
                key={image.src}
                src={image.src}
                alt={image.alt}
                draggable={false}
                className="media-viewer-note__doodle"
              />
            ))}
          </div>
        )}
      </article>
    </TiltStage>
  )
}
