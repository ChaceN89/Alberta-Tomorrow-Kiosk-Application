/**
  File: JournalEntryThumbnail.tsx | Author: Chace Nielson
  Date Created: Nov 5, 2026
  Date Updated: Nov 5, 2026

  Description:
  - Render the pinned image button and paperclip for a recorded entry.

  Usage:
  - Rendered by RecordedJournalEntry when an entry has an image.

  Notes:
  - The accessible action label reflects the configured image, message, or model viewer.
 */
import { useTranslation } from 'react-i18next'
import { PaperclipIcon } from '@/components/icons/PaperclipIcon'
import type { LearningModule } from '@/modules/types'
import type { JournalEntry } from './types'

type JournalEntryThumbnailProps = {
  entry: JournalEntry
  imageSrc: string
  imageAlt: string
  module: LearningModule
  onOpenEntryMedia: (
    entry: JournalEntry,
    imageSrc: string,
    imageAlt: string,
    origin: Element,
  ) => void
}

export function JournalEntryThumbnail({
  entry,
  imageSrc,
  imageAlt,
  module,
  onOpenEntryMedia,
}: JournalEntryThumbnailProps) {
  const { t } = useTranslation('journal')
  const viewerType = module.journalEntryViewers?.[entry.id]?.type
  const labelKey =
    viewerType === 'message'
      ? 'openMessage'
      : viewerType === 'model'
        ? 'openModel'
        : 'openImage'

  return (
    <div className="relative -my-2 -mr-3 -ml-2 w-52 shrink-0">
      <button
        type="button"
        aria-label={t(labelKey, { title: entry.title })}
        className="group block cursor-zoom-in rounded-md"
        onClick={(event) =>
          onOpenEntryMedia(entry, imageSrc, imageAlt, event.currentTarget)
        }
      >
        <img
          src={imageSrc}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-[8.6rem] w-52 -rotate-5 rounded-md border-2 border-white object-cover shadow-md transition-transform duration-200 group-hover:rotate-0 group-hover:scale-105 group-focus-visible:rotate-0 group-focus-visible:scale-105 motion-reduce:transition-none"
        />
      </button>
      <PaperclipIcon
        className="pointer-events-none absolute -top-3 right-3 size-8 rotate-12 text-ink drop-shadow-md"
        hasImage
      />
    </div>
  )
}
