/**
  File: HomePage.tsx | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Nov 5, 2026

  Description:
  - Display available expeditions from the registry with journal progress.

  Usage:
  - App route pages are rendered by the router.

  Notes:
  - None.
 */
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ModuleCard } from '@/components/modules/ModuleCard'
import { visibleModules } from '@/modules/registry'

export function HomePage() {
  const { t } = useTranslation('home')

  return (
    <section aria-labelledby="home-title" className="space-y-8">
      <div className="space-y-3">
        <p className="font-semibold text-pine">{t('eyebrow')}</p>
        <h1 id="home-title">{t('title')}</h1>
        <p className="text-lg text-muted">{t('description')}</p>
        <Link
          className="button gap-3 px-6 py-4 text-lg shadow-lg transition-transform hover:-translate-y-0.5 motion-reduce:transform-none"
          to="/explore"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
            className="size-6"
          >
            <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3z" />
            <path d="M9 3v15m6-12v15" />
          </svg>
          {t('exploreAlberta')}
        </Link>
      </div>
      <ul
        data-tutorial="expedition-list"
        className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
      >
        {visibleModules.map((module) => (
          <ModuleCard key={module.id} module={module} />
        ))}
      </ul>
    </section>
  )
}
