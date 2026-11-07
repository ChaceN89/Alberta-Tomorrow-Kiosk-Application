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
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useExpeditionProgress } from '@/save-data/expedition-progress'
import type { LearningModule } from '@/modules/types'
import { getModuleOverviewPath } from '@/modules/routes'
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
  // The overview description and journal entries share the module's localized data.
  const { t: tModule } = useTranslation(module.translationNamespace)
  const { t: tJournal } = useTranslation('journal')
  // Read the progress state used by both the header and entry rows.
  const { getExpeditionProgress, isCheckpointComplete } =
    useExpeditionProgress()

  const progress = getExpeditionProgress(module)
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
      <div className="space-y-2">
        <p className="text-muted">{tModule(module.descriptionKey)}</p>
        <Link
          className="inline-flex min-h-11 items-center font-semibold text-pine underline decoration-current underline-offset-4 hover:text-pine-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          to={getModuleOverviewPath(module.id)}
          onClick={onNavigate}
        >
          {tJournal('returnToOverview')}
        </Link>
      </div>
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
