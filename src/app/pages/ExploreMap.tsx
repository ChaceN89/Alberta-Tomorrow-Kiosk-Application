/**
  File: ExploreMap.tsx | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Show a placeholder for default or module-specific Alberta map exploration.

  Usage:
  - Rendered by /explore and /expeditions/modules/:moduleId/explore.

  Notes:
  - Map rendering and activity-specific map configuration will be added later.
 */
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { ModuleNotFound } from '@/components/modules/ModuleNotFound'
import { visibleModules } from '@/modules/registry'

export function ExploreMap() {
  const { moduleId } = useParams()

  if (!moduleId) {
    return <DefaultExplorePlaceholder />
  }

  const module = visibleModules.find((entry) => entry.id === moduleId)

  if (!module) {
    return <ModuleNotFound />
  }

  return <ModuleExplorePlaceholder moduleId={module.id} />
}

function DefaultExplorePlaceholder() {
  const { t } = useTranslation('global')

  return (
    <section aria-labelledby="explore-title" className="max-w-3xl space-y-4">
      <h1 id="explore-title">{t('explore.title')}</h1>
      <p className="text-lg text-muted">{t('explore.defaultPlaceholder')}</p>
    </section>
  )
}

function ModuleExplorePlaceholder({ moduleId }: { moduleId: string }) {
  const module = visibleModules.find((entry) => entry.id === moduleId)

  if (!module) {
    throw new Error(`Explore route references unknown module "${moduleId}".`)
  }

  const { t } = useTranslation('global')
  const { t: tModule } = useTranslation(module.translationNamespace)
  const moduleName = tModule('title')

  return (
    <section aria-labelledby="explore-title" className="max-w-3xl space-y-4">
      <h1 id="explore-title">{t('explore.moduleTitle', { moduleName })}</h1>
      <p className="text-lg text-muted">
        {t('explore.modulePlaceholder', { moduleName })}
      </p>
    </section>
  )
}
