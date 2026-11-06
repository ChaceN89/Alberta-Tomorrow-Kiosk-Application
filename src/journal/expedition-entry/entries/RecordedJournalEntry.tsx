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

  return (
    <li className="rounded-xl border border-pine/40 bg-canvas p-4">
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
      {entry.media.length > 0 && (
        <JournalEntryMediaList entry={entry} module={module} />
      )}
    </li>
  )
}
