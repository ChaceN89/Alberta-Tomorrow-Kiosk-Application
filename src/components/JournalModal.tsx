/**
 * File: JournalModal.tsx | Author: Chace Nielson
 * Created: 2026-10-23 | Updated: 2026-10-23
 * Description: Show a title page and a page for each started expedition in the journal.
 * Dependencies: Native dialog, React Router, react-i18next, journal context, module registry.
 */
import { useEffect, useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import logo from '../assets/expedition.svg'
import { useJournal } from '../journal/useJournal'
import { modules } from '../modules/registry'
import type { LearningModule } from '../modules/types'
import { ExpeditionPeak, ExpeditionStatusText } from './ExpeditionPeak'
import { ModuleTitle } from './ModuleTitle'

type JournalPage = LearningModule | null

type JournalTitlePageProps = {
  hasEntries: boolean
  onNavigate: () => void
}

type ExpeditionEntryProps = {
  module: LearningModule
  onNavigate: () => void
}

function JournalTitlePage({ hasEntries, onNavigate }: JournalTitlePageProps) {
  const { t } = useTranslation('journal')
  const stepsId = useId()
  const steps = t('about.steps', { returnObjects: true })

  return (
    <article className="space-y-5">
      <header className="flex items-center gap-4">
        <img src={logo} alt="" className="size-16 shrink-0" />
      </header>
      <p className="text-muted">{t('about.description')}</p>
      <section aria-labelledby={stepsId} className="space-y-3">
        <h4 id={stepsId} className="text-base font-semibold">
          {t('about.stepsHeading')}
        </h4>
        <ol className="list-decimal space-y-2 pl-6 text-muted">
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>
      <p className="text-sm text-muted">{t('about.saved')}</p>
      {!hasEntries && (
        <div className="space-y-3 rounded-xl border border-dashed border-line p-4">
          <p className="font-semibold">{t('about.empty')}</p>
          <Link className="button" to="/" onClick={onNavigate}>
            {t('about.browse')}
          </Link>
        </div>
      )}
    </article>
  )
}

function ExpeditionEntry({ module, onNavigate }: ExpeditionEntryProps) {
  const { t: tModule } = useTranslation(module.translationNamespace)
  const { t } = useTranslation('journal')
  const { getExpeditionProgress, isCheckpointComplete } = useJournal()
  const progress = getExpeditionProgress(module)
  const entries = tModule('journal.entries', { returnObjects: true })

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
  const switcherRef = useRef<HTMLDivElement>(null)
  const switcherButtonRef = useRef<HTMLButtonElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [isListOpen, setIsListOpen] = useState(false)
  const titleId = useId()
  const listId = useId()

  // Page 0 is the title page; the rest are started expeditions in registry order.
  const startedModules = modules.filter(
    (entry) => getExpeditionProgress(entry).status !== 'notStarted',
  )
  const pages: JournalPage[] = [null, ...startedModules]
  const activeIndex = Math.max(
    0,
    pages.findIndex((page) => (page?.id ?? null) === activeModuleId),
  )
  const activePage = pages[activeIndex] ?? null
  const entryCount = startedModules.length

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

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 })
  }, [activePage?.id])

  useEffect(() => {
    if (!isListOpen) return

    const closeOnOutsidePress = (event: PointerEvent) => {
      if (!switcherRef.current?.contains(event.target as Node)) {
        setIsListOpen(false)
      }
    }

    document.addEventListener('pointerdown', closeOnOutsidePress)
    return () =>
      document.removeEventListener('pointerdown', closeOnOutsidePress)
  }, [isListOpen])

  const handleClose = () => {
    setIsListOpen(false)
    closeJournal()
  }

  const goToPage = (page: JournalPage) => {
    selectExpedition(page?.id ?? null)
    setIsListOpen(false)
  }

  const goByOffset = (offset: number) => {
    goToPage(
      pages[(activeIndex + offset + pages.length) % pages.length] ?? null,
    )
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className="m-auto h-[90dvh] w-[min(56rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-line bg-surface p-0 text-ink shadow-2xl backdrop:bg-ink/50 backdrop:backdrop-blur-sm"
      onClose={handleClose}
      onKeyDown={(event) => {
        // The page-switcher dropdown handles its own Escape key first.
        if (event.key === 'Escape') {
          event.preventDefault()
          handleClose()
        }
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          handleClose()
        }
      }}
    >
      <div className="flex h-full flex-col">
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-line p-4 md:px-6">
          <h2 id={titleId} className="text-xl">
            {entryCount === 0
              ? t('title')
              : t('titleWithCount', { count: entryCount })}
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
        <div
          ref={switcherRef}
          className="relative z-10 shrink-0 border-b border-line p-4 md:px-6"
          onKeyDown={(event) => {
            if (event.key === 'Escape' && isListOpen) {
              event.preventDefault()
              event.stopPropagation()
              setIsListOpen(false)
              switcherButtonRef.current?.focus()
            }
          }}
        >
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="button-secondary w-12 shrink-0 px-0"
              aria-label={t('previous')}
              disabled={pages.length < 2}
              onClick={() => goByOffset(-1)}
            >
              <span aria-hidden="true">←</span>
            </button>
            <button
              ref={switcherButtonRef}
              type="button"
              className="flex min-h-12 min-w-0 flex-1 items-center justify-between gap-3 rounded-xl border-2 border-line px-4 py-2 text-left hover:bg-canvas"
              aria-expanded={isListOpen}
              aria-controls={listId}
              onClick={() => setIsListOpen((open) => !open)}
            >
              <span className="min-w-0">
                <span className="block text-xs font-semibold text-muted">
                  {activePage
                    ? t('expeditionNumber', {
                        number: activeIndex,
                        total: entryCount,
                      })
                    : t('titlePage')}
                </span>
                <span className="block truncate font-semibold">
                  {activePage ? (
                    <ModuleTitle module={activePage} />
                  ) : (
                    t('aboutNav')
                  )}
                </span>
              </span>
              <span aria-hidden="true">{isListOpen ? '▴' : '▾'}</span>
            </button>
            <button
              type="button"
              className="button-secondary w-12 shrink-0 px-0"
              aria-label={t('next')}
              disabled={pages.length < 2}
              onClick={() => goByOffset(1)}
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>
          {isListOpen && (
            <ul
              id={listId}
              aria-label={t('expeditionList')}
              className="absolute inset-x-4 top-full z-20 mt-1 max-h-[min(20rem,50dvh)] space-y-1 overflow-y-auto rounded-xl border border-line bg-surface p-2 shadow-xl md:inset-x-6"
            >
              {pages.map((page, index) => {
                const progress = page ? getExpeditionProgress(page) : null

                return (
                  <li key={page?.id ?? 'title-page'}>
                    <button
                      type="button"
                      aria-current={index === activeIndex ? 'true' : undefined}
                      className="flex min-h-12 w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-canvas aria-current:bg-canvas aria-current:font-semibold"
                      onClick={() => goToPage(page)}
                    >
                      {page && progress ? (
                        <ExpeditionPeak
                          progress={progress}
                          className="size-8"
                        />
                      ) : (
                        <img src={logo} alt="" className="size-8 shrink-0" />
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="block truncate">
                          {page ? (
                            <>
                              {index}. <ModuleTitle module={page} />
                            </>
                          ) : (
                            t('titlePage')
                          )}
                        </span>
                        <span className="block text-xs text-muted">
                          {page && progress ? (
                            <ExpeditionStatusText progress={progress} />
                          ) : (
                            t('aboutNav')
                          )}
                        </span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
        <div
          ref={contentRef}
          className="min-h-0 flex-1 overflow-y-auto p-4 scrollbar-thin md:p-6"
        >
          {!isStorageAvailable && (
            <p
              role="status"
              className="mb-4 rounded-xl border border-flag p-3 text-sm"
            >
              {t('storageUnavailable')}
            </p>
          )}
          {activePage ? (
            <ExpeditionEntry
              key={activePage.id}
              module={activePage}
              onNavigate={handleClose}
            />
          ) : (
            <JournalTitlePage
              hasEntries={entryCount > 0}
              onNavigate={handleClose}
            />
          )}
        </div>
      </div>
    </dialog>
  )
}
