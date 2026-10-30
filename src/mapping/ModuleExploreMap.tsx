/**
  File: ModuleExploreMap.tsx | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Show the Alberta map with information for the selected module.

  Usage:
  - Rendered at /expeditions/:moduleId/explore.

  Notes:
  - Module-specific map settings and activity navigation are not connected yet.
 */
import { useTranslation } from 'react-i18next'
import type { LearningModule } from '@/modules/types'
import { AlbertaMap } from './AlbertaMap'
import { ExploreMapNavigation } from './components/ExploreMapNavigation'

type ModuleExploreMapProps = {
  module: LearningModule
}

export function ModuleExploreMap({ module }: ModuleExploreMapProps) {
  const { t } = useTranslation('mapping')
  const { t: tModule } = useTranslation(module.translationNamespace)
  const moduleName = tModule('title')

  // Add module-specific map settings here when module mapping data is ready:
  // const mapSettings = getMapSettingsForModule(module.id)
  //
  // If exploring a module should open its activity instead:
  // navigate(getModuleActivityPath(module.id))

  return (
    <main className="relative h-dvh w-full overflow-hidden">
      <AlbertaMap ariaLabel={t('moduleMapLabel', { moduleName })} />
      <ExploreMapNavigation moduleId={module.id} />
      <section
        aria-labelledby="explore-title"
        className="panel absolute top-20 left-4 w-[calc(100%-2rem)] max-w-sm space-y-3 bg-surface/95 p-4 shadow-xl backdrop-blur"
      >
        <h1 id="explore-title" className="text-2xl">
          {t('moduleTitle', { moduleName })}
        </h1>
        <p>{tModule('description')}</p>
        <p className="text-sm text-muted">{t('moduleMapStatus')}</p>
      </section>
    </main>
  )
}
