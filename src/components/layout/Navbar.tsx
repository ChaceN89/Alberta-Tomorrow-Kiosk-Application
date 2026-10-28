/**
  File: Navbar.tsx | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Render the app brand, navigation actions, language switcher, and module preload progress.
  - Keep journal access available throughout the app and tour access on the home page.

  Usage:
  - Rendered by Layout above the routed page content.

  Notes:
  - Reuses the shared Dropdown for language selection.
 */
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import logo from '../../assets/expedition.svg'
import { useIntroTour } from '../../site-tours/intro-tour/useIntroTour'
import { useJournal } from '../../journal/useJournal'
import { useModulePreload } from '../../modules/useModulePreload'
import { Dropdown } from '../shared/Dropdown'
import { JournalIcon } from '../shared/JournalIcon'

export function Navbar() {
  const { t, i18n } = useTranslation('global')
  const { t: tJournal } = useTranslation('journal')
  const { pathname } = useLocation()
  const { state: preloadState } = useModulePreload()
  const { openJournal } = useJournal()
  const { restartTour } = useIntroTour()
  const languages = [
    { id: 'en', label: t('language.en') },
    { id: 'fr', label: t('language.fr') },
  ]
  const currentLanguage = i18n.resolvedLanguage ?? 'en'

  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link
          to="/"
          className="flex min-h-12 items-center gap-3 text-xl font-bold text-pine"
        >
          <img src={logo} alt="" className="size-9" />
          {t('app.name')}
        </Link>
        <div className="flex flex-wrap items-center gap-6">
          <nav
            aria-label={t('navigation.label')}
            className="flex items-center gap-4"
          >
            <Link
              to="/"
              className="text-link"
              aria-current={pathname === '/' ? 'page' : undefined}
            >
              {t('navigation.home')}
            </Link>
            <button
              type="button"
              data-tour="journal-button"
              className="button-secondary min-h-12 gap-2 px-4 py-2"
              aria-label={tJournal('openLabel')}
              onClick={() =>
                openJournal(pathname.match(/^\/modules\/([^/]+)/)?.[1])
              }
            >
              <JournalIcon />
              {tJournal('open')}
            </button>
            {pathname === '/' && (
              <button
                type="button"
                className="button-secondary size-12 shrink-0 rounded-full p-0"
                aria-label={t('navigation.startTour')}
                onClick={restartTour}
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  focusable="false"
                  className="size-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M9.6 9a2.4 2.4 0 1 1 3.8 1.9c-.9.7-1.4 1.1-1.4 2.6" />
                  <path d="M12 17h.01" />
                </svg>
              </button>
            )}
          </nav>
          <Dropdown
            ariaLabel={t('language.label')}
            items={languages}
            onSelect={(language) => void i18n.changeLanguage(language.id)}
            selectedId={currentLanguage}
            triggerLabel={
              languages.find((language) => language.id === currentLanguage)
                ?.label ?? t('language.en')
            }
          />
        </div>
      </div>
      <div className="h-1 w-full">
        {preloadState.status === 'loading' && (
          <div
            role="progressbar"
            aria-label={t('preload.progressLabel')}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={preloadState.progress}
            aria-valuetext={t('preload.progressValue', {
              percent: preloadState.progress,
            })}
            className="h-full w-full bg-line"
          >
            <div
              className="h-full bg-pine transition-[width] duration-150"
              style={{ width: `${preloadState.progress}%` }}
            />
          </div>
        )}
      </div>
    </header>
  )
}
