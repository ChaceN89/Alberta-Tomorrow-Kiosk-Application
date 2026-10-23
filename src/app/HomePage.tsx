/**
 * File: HomePage.tsx | Author: Chace Nielson
 * Created: 2026-10-23 | Updated: 2026-10-23
 * Description: Display available learning modules from the registry.
 * Dependencies: React Router, react-i18next, module registry.
 */
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { modules } from '../modules/registry'

export function HomePage() {
  const { t } = useTranslation()

  return (
    <section aria-labelledby="home-title" className="space-y-8">
      <div className="max-w-2xl space-y-3">
        <p className="font-semibold text-pine">{t('home.eyebrow')}</p>
        <h1 id="home-title">{t('home.title')}</h1>
        <p className="text-lg text-muted">{t('home.description')}</p>
      </div>
      <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {modules.map((module) => (
          <li key={module.id} className="panel flex flex-col gap-4">
            <div className="flex flex-wrap gap-3 text-sm font-semibold text-pine">
              <span>{t(`categories.${module.category}`)}</span>
              <span>
                {t('modules.duration', { count: module.estimatedMinutes })}
              </span>
            </div>
            <h2>{t(module.titleKey)}</h2>
            <p className="grow text-muted">{t(module.descriptionKey)}</p>
            <Link className="button self-start" to={`/modules/${module.id}`}>
              {t('home.startModule', { title: t(module.titleKey) })}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
