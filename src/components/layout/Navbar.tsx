/**
  File: Navbar.tsx | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Nov 8, 2026

  Description:
  - Render the app brand, navigation actions, language switcher, and module preload progress.
  - Keep journal access available throughout the app and tutorial access on the home page.

  Usage:
  - Rendered by Layout above the routed page content.

  Notes:
  - Reuses the shared Dropdown for language selection.
 */
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import logo from '@/assets/expedition.svg'
import { useIntroTutorial } from '@/tutorials/specific-tutorials/intro-tutorial/useIntroTutorial'
import { useJournal } from '@/journal/context/useJournal'
import { useModulePreload } from '@/modules/useModulePreload'
import { Dropdown } from '@/components/shared/Dropdown'
import { HelpIcon } from '@/components/icons/HelpIcon'
import { JournalIcon } from '@/components/icons/JournalIcon'
import { MapIcon } from '@/components/icons/MapIcon'
import { PlaneIcon } from '@/components/icons/PlaneIcon'
import { Tooltip } from '@/components/shared/Tooltip'

export function Navbar() {
  const { t, i18n } = useTranslation('global')
  const { t: tJournal } = useTranslation('journal')
  const { pathname } = useLocation()
  const { state: preloadState } = useModulePreload()
  const { openJournal } = useJournal()
  const { restartTutorial } = useIntroTutorial()
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
            <Tooltip text={t('navigation.exploreMap')}>
              <Link
                to="/explore"
                className="button-secondary size-12 shrink-0 p-0"
                aria-label={t('navigation.exploreMap')}
                aria-current={pathname === '/explore' ? 'page' : undefined}
              >
                <MapIcon />
              </Link>
            </Tooltip>
            <Tooltip text={t('navigation.flyoverMap')}>
              <Link
                to="/explore?flyover=true"
                className="button-secondary size-12 shrink-0 p-0"
                aria-label={t('navigation.flyoverMap')}
              >
                <PlaneIcon />
              </Link>
            </Tooltip>
            <button
              type="button"
              data-tutorial="journal-button"
              className="button-secondary min-h-12 gap-2 px-4 py-2"
              aria-label={tJournal('openLabel')}
              onClick={() =>
                openJournal(pathname.match(/^\/expeditions\/([^/]+)/)?.[1])
              }
            >
              <JournalIcon />
              {tJournal('open')}
            </button>
            {pathname === '/' && (
              <button
                type="button"
                className="group inline-flex size-12 shrink-0 items-center justify-center rounded-full p-0 text-pine hover:text-pine-dark"
                aria-label={t('navigation.startTutorial')}
                onClick={restartTutorial}
              >
                <HelpIcon className="size-6 transition-transform duration-200 group-hover:scale-110 motion-reduce:transition-none" />
              </button>
            )}
          </nav>
          <Dropdown
            ariaLabel={t('language.label')}
            items={languages}
            onSelect={(language) => void i18n.changeLanguage(language.id)}
            selectedId={currentLanguage}
            triggerLabel={currentLanguage.toUpperCase()}
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
