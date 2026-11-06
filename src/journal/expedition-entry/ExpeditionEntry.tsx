/**
  File: ExpeditionEntry.tsx | Author: Chace Nielson
  Date Created: Nov 5, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Render a module's journal summary, recorded entries, and navigation actions.

  Usage:
  - Rendered as a journal page by JournalModal.

  Notes:
  - Entry copy comes from module locales; attachments come from the module journal manifest.
 */
import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { useExpeditionProgress } from '@/save-data/expedition-progress'
import type { LearningModule } from '@/modules/types'
import { ExpeditionEntryActions } from './ExpeditionEntryActions'
import { ExpeditionEntryHeader } from './ExpeditionEntryHeader'
import { JournalEntryGroups } from './entries/JournalEntryGroups'
import type { JournalEntry } from './entries/types'

type ExpeditionEntryProps = {
  module: LearningModule
  onNavigate: () => void
}

// Connect this module's journal content, saved progress, and media attachments.
export function ExpeditionEntry({ module, onNavigate }: ExpeditionEntryProps) {
  // Load journal copy from this module's translation namespace.
  const { t: tModule } = useTranslation(module.translationNamespace)
  // Read the progress state used by both the header and entry rows.
  const { getExpeditionProgress, isCheckpointComplete } =
    useExpeditionProgress()

  const progress = getExpeditionProgress(module)
  const journalDescription = tModule(module.journalDescriptionKey)
  const JournalDescription = module.journalDescription
  const localizedEntries = tModule('journal.entries', { returnObjects: true })
  const localizedEntryIds = new Set<string>()
  const entries: JournalEntry[] = localizedEntries.map((entry) => {
    const definition = module.journalEntries[entry.id]

    if (!definition) {
      throw new Error(
        `Journal entry "${entry.id}" has no media configuration in module "${module.id}".`,
      )
    }

    if (!module.checkpoints.includes(entry.id)) {
      throw new Error(
        `Journal entry "${entry.id}" is not a checkpoint in module "${module.id}".`,
      )
    }

    if (localizedEntryIds.has(entry.id)) {
      throw new Error(
        `Module "${module.id}" has duplicate journal entries for checkpoint "${entry.id}".`,
      )
    }

    localizedEntryIds.add(entry.id)
    return { ...entry, media: definition.media }
  })

  const missingCheckpointEntries = module.checkpoints.filter(
    (checkpointId) => !entries.some((entry) => entry.id === checkpointId),
  )

  if (missingCheckpointEntries.length > 0) {
    throw new Error(
      `Module "${module.id}" is missing journal entries for checkpoints: ${missingCheckpointEntries.join(', ')}.`,
    )
  }

  return (
    <article className="space-y-5">
      <ExpeditionEntryHeader module={module} progress={progress} />
      {JournalDescription ? (
        <Suspense fallback={<p className="text-muted">{journalDescription}</p>}>
          <JournalDescription description={journalDescription} />
        </Suspense>
      ) : (
        <p className="text-muted">{journalDescription}</p>
      )}
      <JournalEntryGroups
        module={module}
        entries={entries}
        isCheckpointComplete={isCheckpointComplete}
      />
      <ExpeditionEntryActions
        moduleId={module.id}
        progress={progress}
        onNavigate={onNavigate}
      />
    </article>
  )
}
