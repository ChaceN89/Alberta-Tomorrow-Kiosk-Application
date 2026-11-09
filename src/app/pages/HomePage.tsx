/**
  File: HomePage.tsx | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Display available expeditions from the registry with journal progress.

  Usage:
  - App route pages are rendered by the router.

  Notes:
  - None.
 */
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { MapIcon } from '@/components/icons/MapIcon'
import { PlaneIcon } from '@/components/icons/PlaneIcon'
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
        <div className="flex flex-wrap gap-3">
          <Link
            className="button gap-3 px-6 py-4 text-lg shadow-lg transition-transform hover:-translate-y-0.5 motion-reduce:transform-none"
            to="/explore"
          >
            <MapIcon className="size-6" />
            {t('exploreAlberta')}
          </Link>
          <Link
            className="button-secondary gap-3 px-6 py-4 text-lg shadow-lg transition-transform hover:-translate-y-0.5 motion-reduce:transform-none"
            to="/explore?flyover=true"
          >
            <PlaneIcon className="size-6" />
            {t('flyoverAlberta')}
          </Link>
        </div>
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
