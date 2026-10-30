/**
  File: ModuleExploreMap.tsx | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Oct 30, 2026 - CN - Add the bottom-left map actions.

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
import { MapActionControls } from './components/MapActionControls'
import { ExploreMapNavBar } from './components/ExploreMapNavBar'
import { MapControls } from './components/MapControls'

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

  // could also load somestuff here for the map, if not already loaded in the module overview page

  return (
    <main className="relative h-dvh w-full overflow-hidden">
      <AlbertaMap
        ariaLabel={t('moduleMapLabel', { moduleName })}
        moduleId={module.id}
      >
        <section
          aria-labelledby="explore-title"
          className="panel absolute top-20 left-4 z-(--z-content-popover) max-h-[calc(100dvh-6rem)] w-[calc(100%-2rem)] max-w-sm space-y-3 overflow-y-auto bg-surface/95 p-4 shadow-xl backdrop-blur"
        >
          <h1 id="explore-title" className="text-2xl">
            {t('moduleTitle', { moduleName })}
          </h1>
          <MapControls />
          <p>{tModule('description')}</p>
          <p className="text-sm text-muted">{t('moduleMapStatus')}</p>
        </section>
        <MapActionControls />
      </AlbertaMap>
      <ExploreMapNavBar moduleId={module.id} />
    </main>
  )
}
