/**
  File: JournalPageSwitcher.tsx | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Navigate between the journal title page and started expedition pages.

  Usage:
  - Rendered in the JournalModal dialog header.

  Notes:
  - None.
 */
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import logo from '@/assets/expedition.svg'
import {
  ExpeditionPeak,
  ExpeditionStatusText,
} from '@/components/modules/ExpeditionPeak'
import { ModuleTitle } from '@/components/modules/ModuleTitle'
import { useJournal } from '@/journal/useJournal'
import type { LearningModule } from '@/modules/types'

type JournalPageSwitcherProps = {
  pages: readonly (LearningModule | null)[]
  activePage: LearningModule | null
  activeIndex: number
  entryCount: number
}

export function JournalPageSwitcher({
  pages,
  activePage,
  activeIndex,
  entryCount,
}: JournalPageSwitcherProps) {
  const { t } = useTranslation('journal')
  const { getExpeditionProgress, selectExpedition } = useJournal()
  const switcherRef = useRef<HTMLDivElement>(null)
  const switcherButtonRef = useRef<HTMLButtonElement>(null)
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

  const goToPage = (page: LearningModule | null) => {
    selectExpedition(page?.id ?? null)
    setIsListOpen(false)
  }

  const goByOffset = (offset: number) => {
    goToPage(
      pages[(activeIndex + offset + pages.length) % pages.length] ?? null,
    )
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
              {activePage
                ? t('expeditionNumber', {
                    number: activeIndex,
                    total: entryCount,
                  })
                : t('titlePage')}
            </span>
            <span className="block truncate font-semibold">
              {activePage ? <ModuleTitle module={activePage} /> : t('aboutNav')}
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
                    <ExpeditionPeak progress={progress} className="size-8" />
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
  )
}
