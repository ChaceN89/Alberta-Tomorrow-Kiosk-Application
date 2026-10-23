/**
 * File: Layout.tsx | Author: Chace Nielson
 * Created: 2026-10-23 | Updated: 2026-10-23
 * Description: Provide responsive navigation, language controls, and main landmark.
 * Dependencies: React Router, react-i18next, bundled leaf icon.
 */
import { useTranslation } from 'react-i18next'
import { Link, Outlet, useLocation } from 'react-router-dom'
import leaf from '../assets/leaf.svg'

export function Layout() {
  const { t, i18n } = useTranslation()
  const { pathname } = useLocation()

  return (
    <div className="min-h-dvh">
      <a href="#main-content" className="skip-link">
        {t('navigation.skip')}
      </a>
      <header className="border-b border-line bg-white">
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
            <div className="flex items-center gap-3">
              <label htmlFor="language" className="font-medium">
                {t('language.label')}
              </label>
              <select
                id="language"
                className="min-h-12 rounded-lg border border-line bg-white px-3"
                value={i18n.resolvedLanguage ?? 'en'}
                onChange={(event) =>
                  void i18n.changeLanguage(event.target.value)
                }
              >
                <option value="en" lang="en">
                  {t('language.en')}
                </option>
                <option value="fr" lang="fr">
                  {t('language.fr')}
                </option>
              </select>
            </div>
          </div>
        </div>
      </header>
      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto max-w-6xl px-6 py-10 md:py-14"
      >
        <Outlet />
      </main>
    </div>
  )
}
