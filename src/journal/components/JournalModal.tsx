/**
  File: JournalModal.tsx | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Show the journal dialog and coordinate its active page.

  Usage:
  - Rendered by App inside the journal and media-viewer providers.

  Notes:
  - None.
 */
import { useEffect, useId, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useJournal } from '@/journal/useJournal'
import { useMediaViewer } from '@/module-tools/media-viewer/hooks/useMediaViewer'
import { useExpeditionProgress } from '@/save-data/useExpeditionProgress'
import { visibleModules } from '@/modules/registry'
import { ExpeditionEntry } from './ExpeditionEntry'
import { JournalPageSwitcher } from './JournalPageSwitcher'
import { JournalTitlePage } from './JournalTitlePage'

export function JournalModal() {
  const { t } = useTranslation('journal')
  const { isOpen, closeJournal, activeModuleId } = useJournal()
  const { isOpen: isMediaViewerOpen } = useMediaViewer()
  const { isStorageAvailable, getExpeditionProgress } = useExpeditionProgress()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const titleId = useId()

  // Page 0 is the title page; the rest are started expeditions in registry order.
  const startedModules = visibleModules.filter(
    (entry) => getExpeditionProgress(entry).status !== 'notStarted',
  )
  const pages = [null, ...startedModules]
  const activeIndex = Math.max(
    0,
    pages.findIndex((page) => (page?.id ?? null) === activeModuleId),
  )
  const activePage = pages[activeIndex] ?? null
  const entryCount = startedModules.length

  useEffect(() => {
    const dialog = dialogRef.current

    if (!dialog) return

    if (isOpen && !isMediaViewerOpen && !dialog.open) {
      dialog.showModal()
    } else if (!isOpen && dialog.open) {
      dialog.close()
    }
  }, [isMediaViewerOpen, isOpen])

  useEffect(() => {
    if (!isOpen || isMediaViewerOpen) return

    const root = document.documentElement
    const previousOverflow = root.style.overflow

    root.style.overflow = 'hidden'

    return () => {
      root.style.overflow = previousOverflow
    }
  }, [isMediaViewerOpen, isOpen])

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 })
  }, [activePage?.id])

  const handleClose = () => {
    closeJournal()
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className="m-auto h-[90dvh] w-[min(64rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-line bg-surface p-0 text-ink shadow-2xl backdrop:bg-ink/50 backdrop:backdrop-blur-sm"
      onClose={handleClose}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          if (
            event.target instanceof Element &&
            event.target.closest('[id$="-dev-tools-root"]')
          ) {
            return
          }

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
        <div id="journal-audio-player-root" className="contents" />
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
        {isOpen && (
          <JournalPageSwitcher
            pages={pages}
            activePage={activePage}
            activeIndex={activeIndex}
            entryCount={entryCount}
          />
        )}
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
