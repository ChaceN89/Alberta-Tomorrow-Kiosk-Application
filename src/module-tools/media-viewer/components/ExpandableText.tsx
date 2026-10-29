/**
  File: ExpandableText.tsx | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Show text clamped to two lines with a "See more" toggle when it is longer.

  Usage:
  - Rendered by ImageViewerBody for an image's description.

  Notes:
  - The toggle only appears when the text is cut off, and re-checks when the width changes.
 */
import { useId, useLayoutEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

type ExpandableTextProps = {
  text: string
}

export function ExpandableText({ text }: ExpandableTextProps) {
  const { t } = useTranslation('moduleTools')
  const textRef = useRef<HTMLParagraphElement>(null)
  const textId = useId()
  const [isExpanded, setExpanded] = useState(false)
  const [isCutOff, setCutOff] = useState(false)

  useLayoutEffect(() => {
    const element = textRef.current

    if (!element || isExpanded) return

    const measure = () =>
      setCutOff(element.scrollHeight > element.clientHeight + 1)
    const observer = new ResizeObserver(measure)

    measure()
    observer.observe(element)
    return () => observer.disconnect()
  }, [isExpanded, text])

  return (
    <div>
      <p
        ref={textRef}
        id={textId}
        className={`text-muted ${isExpanded ? '' : 'line-clamp-2'}`}
      >
        {text}
      </p>
      {(isCutOff || isExpanded) && (
        <button
          type="button"
          className="-ml-1 mt-1 min-h-10 rounded-lg px-1 font-semibold text-pine underline decoration-2 underline-offset-4"
          aria-expanded={isExpanded}
          aria-controls={textId}
          onClick={() => setExpanded(!isExpanded)}
        >
          {t(isExpanded ? 'mediaViewer.seeLess' : 'mediaViewer.seeMore')}
        </button>
      )}
    </div>
  )
}
