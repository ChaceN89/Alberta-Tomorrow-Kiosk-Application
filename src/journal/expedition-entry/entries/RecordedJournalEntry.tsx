/**
  File: RecordedJournalEntry.tsx | Author: Chace Nielson
  Date Created: Nov 5, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Render a recorded journal entry with its configured media attachments.

  Usage:
  - Rendered as an item in JournalEntryGroups.

  Notes:
  - Attachments are rendered from the module's journal manifest.
 */
import { useTranslation } from 'react-i18next'
import type { LearningModule } from '@/modules/types'
import { JournalEntryMediaList } from './JournalEntryMediaList'
import type { JournalEntry } from './types'

type RecordedJournalEntryProps = {
  entry: JournalEntry
  module: LearningModule
  isInSection: boolean
}

// Show a completed entry with its optional media and module-specific action.
export function RecordedJournalEntry({
  entry,
  module,
  isInSection,
}: RecordedJournalEntryProps) {
  // The recorded label is shared across all module journals.
  const { t } = useTranslation('journal')
  const mediaOnRight = entry.media.slice(0, 2)
  const mediaBelow = entry.media.slice(2)

  return (
    <li className="rounded-xl border border-pine/40 bg-canvas p-4">
      <div className="flex flex-wrap items-start gap-4">
        <div className="min-w-0 flex-1 basis-64">
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
        {mediaOnRight.length > 0 && (
          <JournalEntryMediaList
            entry={entry}
            media={mediaOnRight}
            module={module}
            alignment="right"
          />
        )}
      </div>
      {mediaBelow.length > 0 && (
        <JournalEntryMediaList
          entry={entry}
          media={mediaBelow}
          module={module}
          alignment="left"
          className="mt-4"
        />
      )}
    </li>
  )
}
