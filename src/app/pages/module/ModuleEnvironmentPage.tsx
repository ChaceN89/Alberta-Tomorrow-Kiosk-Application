/**
  File: ModuleEnvironmentPage.tsx | Author: Chace Nielson
  Date Created: Nov 6, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Provide a localized placeholder for modules whose future start is an environment.

  Usage:
  - Rendered for the module's /environment route until its environment is built.

  Notes:
  - Replace this page with the module's environment experience when available.
 */
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import type { LearningModule } from '@/modules/types'
import { getModuleOverviewPath } from '@/modules/routes'

type ModuleEnvironmentPageProps = {
  module: LearningModule
}

export function ModuleEnvironmentPage({ module }: ModuleEnvironmentPageProps) {
  const { t } = useTranslation('global')
  const { t: tModule } = useTranslation(module.translationNamespace)
  const moduleName = tModule(module.titleKey)

  return (
    <section
      aria-labelledby="module-environment-title"
      className="panel max-w-3xl space-y-4"
    >
      <h1 id="module-environment-title">
        {t('moduleEnvironment.title', { moduleName })}
      </h1>
      <p className="text-muted">{t('moduleEnvironment.description')}</p>
      <Link className="button-secondary" to={getModuleOverviewPath(module.id)}>
        {t('moduleEnvironment.backToOverview')}
      </Link>
    </section>
  )
}
