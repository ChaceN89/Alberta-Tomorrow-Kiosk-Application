/**
 * File: HomePage.tsx | Author: Chace Nielson
 * Created: 2026-10-23 | Updated: 2026-10-28
 * Description: Display available expeditions from the registry with journal progress.
 * Dependencies: react-i18next, module registry, module card.
 */
import { useTranslation } from 'react-i18next'
import { ModuleCard } from '../modules/ModuleCard'
import { modules } from '../../modules/registry'

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
        data-tour="expedition-list"
        className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
      >
        {modules.map((module) => (
          <ModuleCard key={module.id} module={module} />
        ))}
      </ul>
    </section>
  )
}
