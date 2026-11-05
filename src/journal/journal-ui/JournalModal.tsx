/**
  File: JournalModal.tsx | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Nov 5, 2026

  Description:
  - Show the journal dialog and coordinate its active page.

  Usage:
  - Rendered by App inside the journal and media-viewer providers.

  Notes:
  - Coordinates native dialog lifecycle, page selection, and close animation.
 */
import { useEffect, useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useJournal } from '@/journal/context/useJournal'
import { useMediaViewer } from '@/module-tools/media-viewer/hooks/useMediaViewer'
import { useExpeditionProgress } from '@/save-data/useExpeditionProgress'
import { visibleModules } from '@/modules/registry'
import { ExpeditionEntry } from '../expedition-entry/ExpeditionEntry'
import { JournalPageSwitcher } from './JournalPageSwitcher'
import { JournalTitlePage } from '@/journal/title-page/JournalTitlePage'

export function JournalModal() {
  // translation hook
  const { t } = useTranslation('journal')

  // the opening and closing state of the journal modal
  const { isOpen, closeJournal, activeModuleId } = useJournal()
  const { isOpen: isMediaViewerOpen } = useMediaViewer()

  // expedition progress
  const { isStorageAvailable, getExpeditionProgress } = useExpeditionProgress()

  //dialog references
  const dialogRef = useRef<HTMLDialogElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const [isClosing, setIsClosing] = useState(false)

  // Page 0 is the title page; the rest are started expeditions in registry order.
  const startedModules = visibleModules.filter(
    (entry) => getExpeditionProgress(entry).status !== 'notStarted',
  )
  // combine the title page and started modules into a single pages array
  const pages = [null, ...startedModules]
  const activeIndex = Math.max(
    0,
    pages.findIndex((page) => (page?.id ?? null) === activeModuleId),
  )
  const activePage = pages[activeIndex] ?? null
  const entryCount = startedModules.length

  // the index of the currently active page within the pages array
  useEffect(() => {
    const dialog = dialogRef.current

    if (!dialog) return

    if (isOpen && !isMediaViewerOpen && !dialog.open) {
      setIsClosing(false)
      dialog.showModal()
    } else if (!isOpen && dialog.open) {
      setIsClosing(false)
      dialog.close()
    }
  }, [isMediaViewerOpen, isOpen])

  // prevent background scrolling when the journal modal is open
  useEffect(() => {
    if (!isOpen || isMediaViewerOpen) return

    const root = document.documentElement
    const previousOverflow = root.style.overflow

    root.style.overflow = 'hidden'

    return () => {
      root.style.overflow = previousOverflow
    }
  }, [isMediaViewerOpen, isOpen])

  // scroll to the top of the content when the active page changes
  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 })
  }, [activePage?.id])

  // handle the closing animation and state of the journal modal
  const handleClose = () => {
    if (isClosing) return

    setIsClosing(true)
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className={`journal-modal m-auto h-[90dvh] w-[min(64rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-line bg-surface p-0 text-ink shadow-2xl backdrop:bg-ink/50 backdrop:backdrop-blur-sm ${
        isClosing ? 'journal-modal--closing' : ''
      }`}
      onClose={() => {
        if (isOpen) closeJournal()
        setIsClosing(false)
      }}
      onAnimationEnd={(event) => {
        if (
          event.target === event.currentTarget &&
          event.animationName === 'journal-slide-out' &&
          isClosing
        ) {
          setIsClosing(false)
          closeJournal()
        }
      }}
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
      onCancel={(event) => {
        event.preventDefault()
        handleClose()
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
