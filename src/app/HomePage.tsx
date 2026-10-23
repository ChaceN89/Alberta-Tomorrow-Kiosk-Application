/**
 * File: HomePage.tsx | Author: Chace Nielson
 * Created: 2026-10-23 | Updated: 2026-10-23
 * Description: Display available learning modules from the registry.
 * Dependencies: React Router, react-i18next, module registry.
 */
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { modules } from '../modules/registry'

type ModuleCardProps = {
  module: (typeof modules)[number]
}

function ModuleCard({ module }: ModuleCardProps) {
  const { t: tModule } = useTranslation(module.translationNamespace)
  const { t: tHome } = useTranslation('home')
  const title = tModule('title')

  return (
    <li className="panel flex flex-col gap-4">
      <div className="flex flex-wrap gap-3 text-sm font-semibold text-pine">
        <span>{tModule('category')}</span>
        <span>
          {tHome('moduleDuration', { count: module.estimatedMinutes })}
        </span>
      </div>
      <h2>{title}</h2>
      <p className="grow text-muted">{tModule('description')}</p>
      <Link className="button self-start" to={`/modules/${module.id}`}>
        {tHome('exploreModule')}
      </Link>
    </li>
  )
}

export function HomePage() {
  const { t } = useTranslation('home')

  return (
    <section aria-labelledby="home-title" className="space-y-8">
      <div className="max-w-2xl space-y-3">
        <p className="font-semibold text-pine">{t('eyebrow')}</p>
        <h1 id="home-title">{t('title')}</h1>
        <p className="text-lg text-muted">{t('description')}</p>
      </div>
      <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {modules.map((module) => (
          <ModuleCard key={module.id} module={module} />
        ))}
      </ul>
    </section>
  )
}
