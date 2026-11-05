/**
  File: RecordedJournalEntry.tsx | Author: Chace Nielson
  Date Created: Nov 5, 2026
  Date Updated: Nov 5, 2026

  Description:
  - Render a recorded journal entry with its optional media and module action.

  Usage:
  - Rendered as an item in JournalEntryGroups.

  Notes:
  - Its optional module action is lazy-loaded so journal display does not load it early.
 */
import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import type { LearningModule } from '@/modules/types'
import { JournalEntryThumbnail } from './JournalEntryThumbnail'
import type { JournalEntry } from './types'

type RecordedJournalEntryProps = {
  entry: JournalEntry
  module: LearningModule
  imageSrc?: string
  isInSection: boolean
  onOpenEntryMedia: (
    entry: JournalEntry,
    imageSrc: string,
    imageAlt: string,
    origin: Element,
  ) => void
}

export function RecordedJournalEntry({
  entry,
  module,
  imageSrc,
  isInSection,
  onOpenEntryMedia,
}: RecordedJournalEntryProps) {
  const { t } = useTranslation('journal')
  const imageAlt = entry.imageAlt ?? ''

  return (
    <li
      className={`rounded-xl border border-pine/40 bg-canvas ${
        imageSrc ? 'py-3 pl-4 pr-0' : 'p-4'
      }`}
    >
      <div
        className={`flex gap-3 ${
          imageSrc
            ? 'items-center'
            : 'flex-col sm:flex-row sm:items-center sm:justify-between'
        }`}
      >
        <div className="min-w-0 grow">
          <p className="text-sm font-semibold text-pine">
            <span aria-hidden="true">✓ </span>
            {t('recorded')}
          </p>
          {isInSection ? (
            <h6 className="font-semibold">{entry.title}</h6>
          ) : (
            <h5 className="font-semibold">{entry.title}</h5>
          )}
          <p className="text-muted">{entry.summary}</p>
        </div>
        {imageSrc && (
          <JournalEntryThumbnail
            entry={entry}
            imageSrc={imageSrc}
            imageAlt={imageAlt}
            module={module}
            onOpenEntryMedia={onOpenEntryMedia}
          />
        )}
        {module.journalEntryAction && (
          <div className="shrink-0">
            <Suspense fallback={null}>
              <module.journalEntryAction
                entryId={entry.id}
                moduleId={module.id}
              />
            </Suspense>
          </div>
        )}
      </div>
    </li>
  )
}
