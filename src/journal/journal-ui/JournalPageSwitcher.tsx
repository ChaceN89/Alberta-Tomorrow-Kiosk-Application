/**
  File: JournalPageSwitcher.tsx | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Navigate between the title, Alberta discoveries, and started expedition pages.

  Usage:
  - Rendered in the JournalModal dialog header.

  Notes:
  - Permanent title and Alberta pages precede started expeditions.
 */
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import logo from '@/assets/expedition.svg'
import { ExpeditionStatusText } from '@/components/modules/ExpeditionPeak'
import { ModuleTitle } from '@/components/modules/ModuleTitle'
import { useJournal } from '@/journal/context/useJournal'
import { useExpeditionProgress } from '@/save-data/expedition-progress'
import type { JournalPage } from './journalPages'
import { BASE_POI_LIST } from '@/mapping/POIs/BasePOIList'
import { useAlbertaDiscoveries } from '@/save-data/alberta-discoveries/useAlbertaDiscoveries'

type JournalPageSwitcherProps = {
  pages: readonly JournalPage[]
  activePage: JournalPage
  activeIndex: number
  entryCount: number
}

export function JournalPageSwitcher({
  pages,
  activePage,
  activeIndex,
  entryCount,
}: JournalPageSwitcherProps) {
  //
  const { t } = useTranslation('journal')
  //
  const { getExpeditionProgress } = useExpeditionProgress()
  const { selectPage } = useJournal()
  const { discoveries } = useAlbertaDiscoveries()
  const discoveryProgress = t('alberta.progress', {
    completed: BASE_POI_LIST.filter((poi) => Object.hasOwn(discoveries, poi.id))
      .length,
    total: BASE_POI_LIST.length,
  })
  const switcherRef = useRef<HTMLDivElement>(null)
  const switcherButtonRef = useRef<HTMLButtonElement>(null)

  // the open/closed state of the page list
  const [isListOpen, setIsListOpen] = useState(false)

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

  const goToPage = (page: JournalPage) => {
    selectPage(page.id)
    setIsListOpen(false)
  }

  const goByOffset = (offset: number) => {
    goToPage(pages[(activeIndex + offset + pages.length) % pages.length])
  }

  return (
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
          aria-controls="journal-page-list"
          onClick={() => setIsListOpen((open) => !open)}
        >
          <span className="min-w-0">
            <span className="block text-xs font-semibold text-muted">
              {activePage.kind === 'expedition'
                ? t('expeditionNumber', {
                    number: activeIndex - 1,
                    total: entryCount,
                  })
                : activePage.kind === 'alberta'
                  ? discoveryProgress
                  : t('titlePage')}
            </span>
            <span className="block truncate font-semibold">
              {activePage.kind === 'expedition' ? (
                <ModuleTitle module={activePage.module} />
              ) : activePage.kind === 'alberta' ? (
                t('alberta.title')
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
          id="journal-page-list"
          aria-label={t('expeditionList')}
          className="absolute inset-x-4 top-full z-20 mt-1 max-h-[min(20rem,50dvh)] space-y-1 overflow-y-auto rounded-xl border border-line bg-surface p-2 shadow-xl md:inset-x-6"
        >
          {pages.map((page, index) => {
            const progress =
              page.kind === 'expedition'
                ? getExpeditionProgress(page.module)
                : null
            const ModuleIcon =
              page.kind === 'expedition' ? page.module.icon : undefined

            return (
              <li key={page.id ?? 'title-page'}>
                <button
                  type="button"
                  aria-current={index === activeIndex ? 'true' : undefined}
                  className="flex min-h-12 w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-canvas aria-current:bg-canvas aria-current:font-semibold"
                  onClick={() => goToPage(page)}
                >
                  {ModuleIcon ? (
                    <ModuleIcon className="size-8 shrink-0 text-pine" />
                  ) : (
                    <img src={logo} alt="" className="size-8 shrink-0" />
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate">
                      {page.kind === 'expedition' ? (
                        <>
                          {index - 1}. <ModuleTitle module={page.module} />
                        </>
                      ) : page.kind === 'alberta' ? (
                        t('alberta.title')
                      ) : (
                        t('titlePage')
                      )}
                    </span>
                    <span className="block text-xs text-muted">
                      {progress ? (
                        <ExpeditionStatusText progress={progress} />
                      ) : page.kind === 'alberta' ? (
                        discoveryProgress
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
  )
}
