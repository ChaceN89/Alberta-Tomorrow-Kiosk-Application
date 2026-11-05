/**
  File: LockedJournalEntry.tsx | Author: Chace Nielson
  Date Created: Nov 5, 2026
  Date Updated: Nov 5, 2026

  Description:
  - Render the locked placeholder for an unrecorded journal entry.

  Usage:
  - Rendered as an item in JournalEntryGroups.

  Notes:
  - The optional paperclip signals that an image will be available when recorded.
 */
import { useTranslation } from 'react-i18next'
import { PaperclipIcon } from '@/components/icons/PaperclipIcon'

type LockedJournalEntryProps = {
  hasImage: boolean
}

export function LockedJournalEntry({ hasImage }: LockedJournalEntryProps) {
  const { t } = useTranslation('journal')

  return (
    <li
      className={`rounded-xl border border-dashed border-line p-4 text-muted ${
        hasImage ? 'relative pr-14' : ''
      }`}
    >
      <p className="font-semibold">{t('locked')}</p>
      <p className="text-sm">{t('lockedHint')}</p>
      {hasImage && (
        <PaperclipIcon className="absolute -top-3 right-3 size-8 rotate-12 text-ink drop-shadow-md" />
      )}
    </li>
  )
}
