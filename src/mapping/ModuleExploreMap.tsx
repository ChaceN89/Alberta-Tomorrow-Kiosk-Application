/**
  File: ModuleExploreMap.tsx | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Show the Alberta map with information for the selected module.

  Usage:
  - Rendered at /expeditions/:moduleId/explore.

  Notes:
  - Module POI descriptions are supplied by each module's POI content components.
 */
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useExpeditionProgress } from '@/save-data/expedition-progress'
import type { LearningModule } from '@/modules/types'
import type { MapPoi } from './components/MapPoiMarker'
import { AlbertaMap } from './AlbertaMap'
import { MapActionControls } from './components/MapActionControls'
import { ExploreMapNavBar } from './components/ExploreMapNavBar'
import { MapControls } from './components/MapControls'
import { ModuleTitleBar } from './components/ModuleTitleBar'

type ModuleExploreMapProps = {
  module: LearningModule
}

export function ModuleExploreMap({ module }: ModuleExploreMapProps) {
  const { t } = useTranslation('mapping')
  const { t: tModule } = useTranslation(module.translationNamespace)
  const { startExpedition, completeCheckpoint, getCompletedCheckpoints } =
    useExpeditionProgress()
  const moduleName = tModule(module.titleKey)
  const moduleMap = module.map
  const completedCheckpoints = getCompletedCheckpoints(module.id)

  useEffect(() => {
    startExpedition(module.id)
  }, [module.id, startExpedition])

  const modulePois: MapPoi[] =
    moduleMap?.pois.flatMap((poi) => {
      const PoiContent = moduleMap.poiContent?.[poi.id]

      return [
        {
          id: poi.id,
          coordinates: poi.coordinates,
          title: tModule(poi.titleKey),
          isComplete:
            completedCheckpoints.includes(poi.checkpointId) &&
            (poi.additionalCompletionCheckpoints ?? []).every((checkpointId) =>
              completedCheckpoints.includes(checkpointId),
            ),
          onActivate: () => completeCheckpoint(module.id, poi.checkpointId),
          info: PoiContent ? (
            <PoiContent
              onComplete={(checkpointId) =>
                completeCheckpoint(module.id, checkpointId)
              }
            />
          ) : undefined,
        },
      ]
    }) ?? []

  return (
    <main className="relative h-dvh w-full overflow-hidden">
      <AlbertaMap
        key={module.id}
        ariaLabel={t('moduleMapLabel', { moduleName })}
        moduleId={module.id}
        modulePois={modulePois}
        defaultPoisVisible={moduleMap?.settings.defaultPoisVisible}
        modulePoisVisible={moduleMap?.settings.modulePoisVisible}
      >
        <MapControls />
        <ModuleTitleBar
          title={t('moduleTitle', { moduleName })}
          description={tModule('description')}
        />
        <MapActionControls />
      </AlbertaMap>
      <ExploreMapNavBar moduleId={module.id} />
    </main>
  )
}
