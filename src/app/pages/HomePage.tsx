/**
  File: HomePage.tsx | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Display available expeditions from the registry with journal progress.

  Usage:
  - App route pages are rendered by the router.

  Notes:
  - None.
 */
import { useTranslation } from 'react-i18next'
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
