/**
 * File: JournalModal.tsx | Author: Chace Nielson
 * Created: 2026-10-23 | Updated: 2026-10-23
 * Description: Show expedition journal pages with a switcher between expeditions.
 * Dependencies: Native dialog, React Router, react-i18next, journal context, module registry.
 */
import { useEffect, useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useJournal } from '../journal/useJournal'
import { modules } from '../modules/registry'
import type { LearningModule } from '../modules/types'
import { ExpeditionPeak, ExpeditionStatusText } from './ExpeditionPeak'
import { ModuleTitle } from './ModuleTitle'

type ExpeditionEntryProps = {
  module: LearningModule
  onNavigate: () => void
}

function ExpeditionEntry({ module, onNavigate }: ExpeditionEntryProps) {
  const { t: tModule } = useTranslation(module.translationNamespace)
  const { t } = useTranslation('journal')
  const { getExpeditionProgress, isCheckpointComplete } = useJournal()
  const progress = getExpeditionProgress(module)
  const entries = tModule('journal.entries', { returnObjects: true })
  const actionKey =
    progress.status === 'complete'
      ? 'revisit'
      : progress.status === 'inProgress'
        ? 'continue'
        : 'start'

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
        <ol className="space-y-3">
          {entries.map((entry) =>
            isCheckpointComplete(module.id, entry.id) ? (
              <li
                key={entry.id}
                className="rounded-xl border border-pine/40 bg-canvas p-4"
              >
                <p className="text-sm font-semibold text-pine">
                  <span aria-hidden="true">✓ </span>
                  {t('recorded')}
                </p>
                <h5 className="font-semibold">{entry.title}</h5>
                <p className="text-muted">{entry.summary}</p>
              </li>
            ) : (
              <li
                key={entry.id}
                className="rounded-xl border border-dashed border-line p-4 text-muted"
              >
                <p className="font-semibold">{t('locked')}</p>
                <p className="text-sm">{t('lockedHint')}</p>
              </li>
            ),
          )}
        </ol>
      </section>
      <div className="flex flex-wrap gap-3">
        <Link
          className="button"
          to={`/modules/${module.id}/activity`}
          onClick={onNavigate}
        >
          {t(actionKey)}
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

export function JournalModal() {
  const { t } = useTranslation('journal')
  const {
    isOpen,
    closeJournal,
    activeModuleId,
    selectExpedition,
    isStorageAvailable,
    getExpeditionProgress,
  } = useJournal()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [isListOpen, setIsListOpen] = useState(false)
  const titleId = useId()
  const listId = useId()
  const activeIndex = Math.max(
    0,
    modules.findIndex((entry) => entry.id === activeModuleId),
  )
  const activeModule = modules[activeIndex]

  useEffect(() => {
    const dialog = dialogRef.current

    if (!dialog) return

    if (isOpen && !dialog.open) {
      dialog.showModal()
    } else if (!isOpen && dialog.open) {
      dialog.close()
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const root = document.documentElement
    const previousOverflow = root.style.overflow

    root.style.overflow = 'hidden'

    return () => {
      root.style.overflow = previousOverflow
    }
  }, [isOpen])

  const handleClose = () => {
    setIsListOpen(false)
    closeJournal()
  }

  const goToExpedition = (offset: number) => {
    const next =
      modules[(activeIndex + offset + modules.length) % modules.length]

    if (next) {
      selectExpedition(next.id)
    }

    setIsListOpen(false)
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className="m-auto h-[80dvh] w-[min(56rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-line bg-surface p-0 text-ink shadow-2xl backdrop:bg-ink/50 backdrop:backdrop-blur-sm"
      onClose={handleClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          handleClose()
        }
      }}
    >
      <div className="flex h-full flex-col">
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-line p-4 md:px-6">
          <h2 id={titleId} className="text-xl">
            {t('title')}
          </h2>
          <button
            type="button"
            className="flex size-12 shrink-0 items-center justify-center rounded-xl text-2xl text-muted hover:bg-canvas"
            aria-label={t('close')}
            onClick={handleClose}
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>
        {activeModule && (
          <>
            <div className="shrink-0 space-y-2 border-b border-line p-4 md:px-6">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="button-secondary w-12 shrink-0 px-0"
                  aria-label={t('previous')}
                  onClick={() => goToExpedition(-1)}
                >
                  <span aria-hidden="true">←</span>
                </button>
                <button
                  type="button"
                  className="flex min-h-12 min-w-0 flex-1 items-center justify-between gap-3 rounded-xl border-2 border-line px-4 py-2 text-left hover:bg-canvas"
                  aria-expanded={isListOpen}
                  aria-controls={listId}
                  onClick={() => setIsListOpen((open) => !open)}
                >
                  <span className="min-w-0">
                    <span className="block text-xs font-semibold text-muted">
                      {t('expeditionNumber', {
                        number: activeIndex + 1,
                        total: modules.length,
                      })}
                    </span>
                    <span className="block truncate font-semibold">
                      <ModuleTitle module={activeModule} />
                    </span>
                  </span>
                  <span aria-hidden="true">{isListOpen ? '▴' : '▾'}</span>
                </button>
                <button
                  type="button"
                  className="button-secondary w-12 shrink-0 px-0"
                  aria-label={t('next')}
                  onClick={() => goToExpedition(1)}
                >
                  <span aria-hidden="true">→</span>
                </button>
              </div>
              {isListOpen && (
                <ul
                  id={listId}
                  aria-label={t('expeditionList')}
                  className="space-y-1 rounded-xl border border-line bg-canvas p-2"
                >
                  {modules.map((module, index) => {
                    const progress = getExpeditionProgress(module)

                    return (
                      <li key={module.id}>
                        <button
                          type="button"
                          aria-current={
                            module.id === activeModule.id ? 'true' : undefined
                          }
                          className="flex min-h-12 w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-surface aria-[current=true]:bg-surface aria-[current=true]:font-semibold"
                          onClick={() => {
                            selectExpedition(module.id)
                            setIsListOpen(false)
                          }}
                        >
                          <ExpeditionPeak
                            progress={progress}
                            className="size-8"
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate">
                              {index + 1}. <ModuleTitle module={module} />
                            </span>
                            <span className="block text-xs text-muted">
                              <ExpeditionStatusText progress={progress} />
                            </span>
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-4 [scrollbar-width:thin] md:p-6">
              {!isStorageAvailable && (
                <p
                  role="status"
                  className="mb-4 rounded-xl border border-flag p-3 text-sm"
                >
                  {t('storageUnavailable')}
                </p>
              )}
              <ExpeditionEntry
                key={activeModule.id}
                module={activeModule}
                onNavigate={handleClose}
              />
            </div>
          </>
        )}
      </div>
    </dialog>
  )
}
