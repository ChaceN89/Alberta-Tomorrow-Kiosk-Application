/**
  File: ExploreMapNavigation.tsx | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Provide map navigation, module links, and journal access outside the map.

  Usage:
  - Rendered by the default and module-specific explore map views.

  Notes:
  - Module links are shown only when the map belongs to a module.
 */
import { useEffect, useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { JournalIcon } from '@/components/icons/JournalIcon'
import { useJournal } from '@/journal/useJournal'
import { getModuleActivityPath, getModuleOverviewPath } from '@/modules/routes'

type ExploreMapNavigationProps = {
  moduleId?: string
}

export function ExploreMapNavigation({ moduleId }: ExploreMapNavigationProps) {
  const { t } = useTranslation('mapping')
  const { t: tJournal } = useTranslation('journal')
  const { openJournal } = useJournal()
  const [isOpen, setIsOpen] = useState(false)
  const navigationId = useId()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const navigationRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!isOpen) return

    navigationRef.current?.querySelector<HTMLElement>('a')?.focus()
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return

      event.preventDefault()
      setIsOpen(false)
      triggerRef.current?.focus()
    }

    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [isOpen])

  const closeNavigation = () => {
    setIsOpen(false)
    triggerRef.current?.focus()
  }

  const navigationLinkClassName =
    'flex min-h-12 items-center rounded-xl px-4 font-semibold text-ink hover:bg-canvas focus-visible:bg-canvas'

  return (
    <>
      <div className="absolute top-4 left-4 z-(--z-content-popover) flex gap-2">
        <button
          ref={triggerRef}
          type="button"
          className="flex size-12 items-center justify-center rounded-full border border-line bg-surface text-pine shadow-lg hover:bg-canvas"
          aria-label={isOpen ? t('navigation.close') : t('navigation.open')}
          aria-expanded={isOpen}
          aria-controls={navigationId}
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? (
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="size-6"
            >
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          ) : (
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="size-6"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
        <button
          type="button"
          className="flex size-12 items-center justify-center rounded-full border border-line bg-surface text-pine shadow-lg hover:bg-canvas"
          aria-label={tJournal('openLabel')}
          title={tJournal('openLabel')}
          onClick={() => openJournal(moduleId)}
        >
          <JournalIcon className="size-6" />
        </button>
      </div>

      <div
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={`absolute inset-0 z-(--z-content-popover) ${
          isOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        <button
          type="button"
          tabIndex={-1}
          aria-label={t('navigation.close')}
          className={`absolute inset-0 bg-ink/35 transition-opacity motion-reduce:transition-none ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={closeNavigation}
        />
        <nav
          ref={navigationRef}
          id={navigationId}
          aria-label={t('navigation.label')}
          className={`absolute inset-y-0 left-0 flex w-[min(21rem,calc(100%-2.5rem))] flex-col border-r border-line bg-surface p-5 shadow-2xl transition-transform motion-reduce:transition-none ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="text-xl">{t('title')}</h2>
            <button
              type="button"
              className="flex size-12 shrink-0 items-center justify-center rounded-xl text-2xl text-muted hover:bg-canvas"
              aria-label={t('navigation.close')}
              onClick={closeNavigation}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className={navigationLinkClassName}
                onClick={() => setIsOpen(false)}
              >
                {t('navigation.home')}
              </Link>
            </li>
            {moduleId && (
              <>
                <li>
                  <Link
                    to={getModuleActivityPath(moduleId)}
                    className={navigationLinkClassName}
                    onClick={() => setIsOpen(false)}
                  >
                    {t('navigation.moduleActivity')}
                  </Link>
                </li>
                <li>
                  <Link
                    to={getModuleOverviewPath(moduleId)}
                    className={navigationLinkClassName}
                    onClick={() => setIsOpen(false)}
                  >
                    {t('navigation.moduleOverview')}
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </>
  )
}
