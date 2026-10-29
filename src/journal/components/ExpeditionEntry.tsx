/**
  File: ExpeditionEntry.tsx | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Render an expedition's recorded and undiscovered journal entries.

  Usage:
  - Rendered as a journal page by JournalModal.

  Notes:
  - None.
 */
import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { PaperclipIcon } from '@/components/icons/PaperclipIcon'
import {
  ExpeditionPeak,
  ExpeditionStatusText,
} from '@/components/modules/ExpeditionPeak'
import { ModuleTitle } from '@/components/modules/ModuleTitle'
import { useJournal } from '@/journal/useJournal'
import type { LearningModule } from '@/modules/types'

type ExpeditionEntryProps = {
  module: LearningModule
  onNavigate: () => void
}

export function ExpeditionEntry({ module, onNavigate }: ExpeditionEntryProps) {
  const { t: tModule } = useTranslation(module.translationNamespace)
  const { t } = useTranslation('journal')
  const { getExpeditionProgress, isCheckpointComplete } = useJournal()
  const progress = getExpeditionProgress(module)
  const entries = tModule('journal.entries', { returnObjects: true })
  type JournalEntry = (typeof entries)[number]
  const entryGroups: {
    section: string | null
    entries: JournalEntry[]
  }[] = []

  for (const entry of entries) {
    const section =
      'section' in entry && typeof entry.section === 'string'
        ? entry.section
        : null
    const previousGroup = entryGroups[entryGroups.length - 1]

    if (previousGroup?.section === section) {
      previousGroup.entries.push(entry)
    } else {
      entryGroups.push({ section, entries: [entry] })
    }
  }

  return (
    <article className="space-y-5">
      <header className="flex items-center gap-4">
        <ExpeditionPeak progress={progress} className="size-20" />
        <div className="min-w-0">
          <h3 className="text-xl font-semibold">
            <ModuleTitle module={module} />
          </h3>
          <p className="text-sm font-semibold text-pine">
            <ExpeditionStatusText progress={progress} />
          </p>
        </div>
      </header>
      <p className="text-muted">{tModule('journal.summary')}</p>
      <section aria-labelledby={`notes-${module.id}`} className="space-y-3">
        <h4 id={`notes-${module.id}`} className="text-base font-semibold">
          {t('notebook')}
        </h4>
        <div className="space-y-5">
          {entryGroups.map((group, index) => {
            const items = (
              <ol className="space-y-3">
                {group.entries.map((entry) => {
                  const imageSrc = module.journalEntryImages?.[entry.id]
                  const imageAlt =
                    'imageAlt' in entry && typeof entry.imageAlt === 'string'
                      ? entry.imageAlt
                      : ''

                  return isCheckpointComplete(module.id, entry.id) ? (
                    <li
                      key={entry.id}
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
                          {group.section ? (
                            <h6 className="font-semibold">{entry.title}</h6>
                          ) : (
                            <h5 className="font-semibold">{entry.title}</h5>
                          )}
                          <p className="text-muted">{entry.summary}</p>
                        </div>
                        {imageSrc && (
                          <div className="relative -my-2 -mr-3 -ml-2 w-52 shrink-0">
                            <img
                              src={imageSrc}
                              alt={imageAlt}
                              loading="lazy"
                              decoding="async"
                              className="h-[8.6rem] w-52 -rotate-5 rounded-md border-2 border-white object-cover shadow-md"
                            />
                            <PaperclipIcon
                              className="absolute -top-3 right-3 size-8 rotate-12 text-ink drop-shadow-md"
                              hasImage
                            />
                          </div>
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
                  ) : (
                    <li
                      key={entry.id}
                      className={`rounded-xl border border-dashed border-line p-4 text-muted ${
                        imageSrc ? 'relative pr-14' : ''
                      }`}
                    >
                      <p className="font-semibold">{t('locked')}</p>
                      <p className="text-sm">{t('lockedHint')}</p>
                      {imageSrc && (
                        <PaperclipIcon className="absolute -top-3 right-3 size-8 rotate-12 text-ink drop-shadow-md" />
                      )}
                    </li>
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
      <div className="flex flex-wrap gap-3">
        <Link
          className="button"
          to={`/modules/${module.id}/expedition`}
          onClick={onNavigate}
        >
          {t(progress.status === 'complete' ? 'revisit' : 'continue')}
        </Link>
        <Link
          className="button-secondary"
          to={`/modules/${module.id}`}
          onClick={onNavigate}
        >
          {t('details')}
        </Link>
      </div>
    </article>
  )
}
