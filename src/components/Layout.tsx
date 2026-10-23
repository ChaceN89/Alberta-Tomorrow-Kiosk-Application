/**
 * File: Layout.tsx | Author: Chace Nielson
 * Created: 2026-10-23 | Updated: 2026-10-23
 * Description: Provide responsive navigation, language controls, and main landmark.
 * Dependencies: React Router, react-i18next, shared dropdown, development tools.
 */
import { useTranslation } from 'react-i18next'
import { Toaster } from 'react-hot-toast'
import { Link, Outlet, useLocation } from 'react-router-dom'
import leaf from '../assets/leaf.svg'
import { useModulePreload } from '../modules/useModulePreload'
import { DisplayTesting } from './development/DisplayTesting'
import { Dropdown } from './Dropdown'

export function Layout() {
  const { t, i18n } = useTranslation('global')
  const { pathname } = useLocation()
  const { state: preloadState } = useModulePreload()
  const languages = [
    { id: 'en', label: t('language.en') },
    { id: 'fr', label: t('language.fr') },
  ]
  const currentLanguage = i18n.resolvedLanguage ?? 'en'

  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#main-content" className="skip-link">
        {t('navigation.skip')}
      </a>
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <Link
            to="/"
            className="flex min-h-12 items-center gap-3 text-xl font-bold text-pine"
          >
            <img src={leaf} alt="" className="size-9" />
            {t('app.name')}
          </Link>
          <div className="flex flex-wrap items-center gap-6">
            <nav aria-label={t('navigation.label')}>
              <Link
                to="/"
                className="text-link"
                aria-current={pathname === '/' ? 'page' : undefined}
              >
                {t('navigation.home')}
              </Link>
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
      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto w-full max-w-6xl flex-1 px-6 py-10 md:py-14"
      >
        <Outlet />
      </main>
      <footer className="border-t border-line bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-5 text-sm text-muted">
          {t('footer.credit')}
        </div>
      </footer>
      <DisplayTesting />
      <Toaster
        position="top-center"
        containerStyle={{ top: 80 }}
        toastOptions={{
          duration: 4000,
          style: {
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-line)',
            borderRadius: '12px',
            color: 'var(--color-ink)',
            width: 'max-content',
            maxWidth: 'calc(100vw - 2rem)',
          },
          loading: {
            iconTheme: {
              primary: 'var(--color-pine)',
              secondary: 'var(--color-surface)',
            },
          },
          error: { duration: 5000 },
        }}
      />
    </div>
  )
}
