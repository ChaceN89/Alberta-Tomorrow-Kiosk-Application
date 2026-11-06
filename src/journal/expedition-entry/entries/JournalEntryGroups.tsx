/**
  File: JournalEntryGroups.tsx | Author: Chace Nielson
  Date Created: Nov 5, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Group translated journal entries by section and render their ordered lists.

  Usage:
  - Rendered within an ExpeditionEntry.

  Notes:
  - Entry ids must match module checkpoints; only consecutive equal sections are grouped.
 */
import { useTranslation } from 'react-i18next'
import type { LearningModule } from '@/modules/types'
import { LockedJournalEntry } from './LockedJournalEntry'
import { RecordedJournalEntry } from './RecordedJournalEntry'
import type { JournalEntry } from './types'

type JournalEntryGroupsProps = {
  module: LearningModule
  entries: readonly JournalEntry[]
  isCheckpointComplete: (moduleId: string, checkpointId: string) => boolean
}

// Render each entry as recorded or locked, grouped by its optional section.
export function JournalEntryGroups({
  module,
  entries,
  isCheckpointComplete,
}: JournalEntryGroupsProps) {
  // The notebook heading and locked/recorded labels are shared journal copy.
  const { t } = useTranslation('journal')
  const entryGroups: { section: string | null; entries: JournalEntry[] }[] = []

  // Keep consecutive entries together so locale order and section changes are preserved.
  for (const entry of entries) {
    const section = entry.section ?? null
    const previousGroup = entryGroups[entryGroups.length - 1]

    if (previousGroup?.section === section) {
      previousGroup.entries.push(entry)
    } else {
      entryGroups.push({ section, entries: [entry] })
    }
  }

  return (
    <section aria-labelledby={`notes-${module.id}`} className="space-y-3">
      <h4 id={`notes-${module.id}`} className="text-base font-semibold">
        {t('notebook')}
      </h4>
      <div className="space-y-5">
        {entryGroups.map((group, index) => {
          const items = (
            <ol className="space-y-3">
              {group.entries.map((entry) => {
                return isCheckpointComplete(module.id, entry.id) ? (
                  <RecordedJournalEntry
                    key={entry.id}
                    entry={entry}
                    module={module}
                    isInSection={group.section !== null}
                  />
                ) : (
                  <LockedJournalEntry
                    key={entry.id}
                    hasMedia={entry.media.length > 0}
                  />
                )
              })}
            </ol>
          )

          if (!group.section) {
            return <div key={`unsectioned-${index}`}>{items}</div>
          }

          const sectionId = `journal-${module.id}-section-${index}`

          return (
            <section
              key={`${group.section}-${index}`}
              aria-labelledby={sectionId}
              className="space-y-3"
            >
              <h5 id={sectionId} className="text-lg font-semibold text-pine">
                {group.section}
              </h5>
              {items}
            </section>
          )
        })}
      </div>
    </section>
  )
}
