/**
  File: JournalModal.tsx | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Show the journal overlay and coordinate its active page.

  Usage:
  - Rendered by App inside the journal and media-viewer providers.

  Notes:
  - Remains mounted while closed so journal content and state do not move between hosts.
 */
import { useEffect, useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAudioPlayer } from '@/module-tools/media-player/hooks/useAudioPlayer'
import { useJournal } from '@/journal/context/useJournal'
import { useMediaViewer } from '@/module-tools/media-viewer/hooks/useMediaViewer'
import { useExpeditionProgress } from '@/save-data/expedition-progress'
import { visibleModules } from '@/modules/registry'
import { useModalFocusTrap } from '@/components/overlays/useModalFocusTrap'
import { ExpeditionEntry } from '../expedition-entry/ExpeditionEntry'
import { JournalPageSwitcher } from './JournalPageSwitcher'
import { JournalTitlePage } from '@/journal/title-page/JournalTitlePage'
import { AlbertaMapEntry } from '../alberta-entry/AlbertaMapEntry'
import { ALBERTA_JOURNAL_PAGE_ID, type JournalPage } from './journalPages'

export function JournalModal() {
  // translation hook
  const { t } = useTranslation('journal')

  // the opening and closing state of the journal modal
  const { isOpen, closeJournal, activePageId } = useJournal()
  const { isOpen: isMediaViewerOpen } = useMediaViewer()
  const { isFullscreen: isPlayerFullscreen } = useAudioPlayer()
  const isUnderlay = isMediaViewerOpen || isPlayerFullscreen

  // expedition progress
  const { isStorageAvailable, getExpeditionProgress } = useExpeditionProgress()

  //dialog references
  const dialogRef = useRef<HTMLDialogElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const [isClosing, setIsClosing] = useState(false)

  // Permanent title and Alberta pages precede started expeditions.
  const startedModules = visibleModules.filter(
    (entry) => getExpeditionProgress(entry).status !== 'notStarted',
  )
  // combine the title page and started modules into a single pages array
  const pages: JournalPage[] = [
    { kind: 'title', id: null },
    { kind: 'alberta', id: ALBERTA_JOURNAL_PAGE_ID },
    ...startedModules.map((module): JournalPage => ({
      kind: 'expedition',
      id: module.id,
      module,
    })),
  ]
  const activeIndex = Math.max(
    0,
    pages.findIndex((page) => page.id === activePageId),
  )
  const activePage = pages[activeIndex]
  const entryCount = startedModules.length

  useModalFocusTrap(dialogRef, isOpen && !isUnderlay)

  // prevent background scrolling when the journal modal is open
  useEffect(() => {
    if (!isOpen || isUnderlay) return

    const root = document.documentElement
    const previousOverflow = root.style.overflow

    root.style.overflow = 'hidden'

    return () => {
      root.style.overflow = previousOverflow
    }
  }, [isOpen, isUnderlay])

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
    <div
      className={`journal-modal-backdrop ${
        isClosing ? 'journal-modal-backdrop--closing' : ''
      }`}
      hidden={!isOpen}
      inert={!isOpen || isUnderlay}
      onClick={(event) => {
        if (event.target === event.currentTarget) handleClose()
      }}
    >
      <dialog
        ref={dialogRef}
        open={isOpen}
        tabIndex={-1}
        aria-modal={isOpen && !isUnderlay ? true : undefined}
        aria-labelledby={titleId}
        className={`journal-modal h-[90dvh] w-[min(64rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-line bg-surface p-0 text-ink shadow-2xl ${
          isClosing ? 'journal-modal--closing' : ''
        }`}
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
      >
        <div className="flex h-full flex-col">
          <header className="flex shrink-0 items-center justify-between gap-4 border-b border-line p-4 md:px-6">
            <h2 id={titleId} className="text-xl">
              {t('titleWithCount', { count: entryCount + 1 })}
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
            {activePage.kind === 'expedition' ? (
              <ExpeditionEntry
                key={activePage.id}
                module={activePage.module}
                onNavigate={handleClose}
              />
            ) : activePage.kind === 'alberta' ? (
              <AlbertaMapEntry onNavigate={handleClose} />
            ) : (
              <JournalTitlePage
                hasEntries={entryCount > 0}
                onNavigate={handleClose}
              />
            )}
          </div>
        </div>
      </dialog>
    </div>
  )
}
