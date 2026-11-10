/**
  File: ModuleExploreMap.tsx | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Show the Alberta map with information for the selected module.

  Usage:
  - Rendered at /expeditions/:moduleId/explore.

  Notes:
  - Module POI descriptions are supplied by each module's POI content components.
 */
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useExpeditionProgress } from '@/save-data/expedition-progress'
import type { LearningModule } from '@/modules/types'
import type { MapPoi } from './components/MapPoiMarker'
import { AlbertaMap } from './AlbertaMap'
import { MapActionControls } from './components/MapActionControls'
import { ExploreMapNavBar } from './components/ExploreMapNavBar'
import { MapControls } from './components/MapControls'
import { ModuleTitleBar } from './components/ModuleTitleBar'
import { getModuleActivityPath } from '@/modules/routes'

type ModuleExploreMapProps = {
  module: LearningModule
}

export function ModuleExploreMap({ module }: ModuleExploreMapProps) {
  const { t } = useTranslation('mapping')
  const { t: tModule, i18n } = useTranslation(module.translationNamespace)
  const {
    startExpedition,
    completeCheckpoint,
    getCompletedCheckpoints,
    getExpeditionProgress,
  } = useExpeditionProgress()
  const moduleName = tModule(module.titleKey)
  const moduleMap = module.map
  const completedCheckpoints = useMemo(
    () => getCompletedCheckpoints(module.id),
    [getCompletedCheckpoints, module.id],
  )
  const language = i18n.resolvedLanguage

  useEffect(() => {
    startExpedition(module.id)
  }, [module.id, startExpedition])

  const modulePois = useMemo<MapPoi[]>(
    () =>
      moduleMap?.pois.flatMap((poi) => {
        const PoiContent = poi.infoContent
        const selectedCheckpointId = poi.poiSelectedCheckpointId

        return [
          {
            id: poi.id,
            coordinates: poi.coordinates,
            iconCategory: poi.iconCategory,
            flyoverRadiusMultiplier: poi.flyoverRadiusMultiplier,
            flyoverCylinderHeightMultiplier:
              poi.flyoverCylinderHeightMultiplier,
            flyoverPoiFov: poi.flyoverPoiFov,
            title: i18n.t(poi.titleKey, {
              ns: poi.titleNamespace ?? module.translationNamespace,
              lng: language,
            }),
            isComplete:
              selectedCheckpointId !== undefined &&
              completedCheckpoints.includes(selectedCheckpointId) &&
              (poi.additionalCompletionCheckpoints ?? []).every(
                (checkpointId) => completedCheckpoints.includes(checkpointId),
              ),
            onActivate: selectedCheckpointId
              ? () => completeCheckpoint(module.id, selectedCheckpointId)
              : undefined,
            info: (
              <PoiContent
                onInteraction={(interactionId) => {
                  const checkpointId = poi.infoCheckpoints?.[interactionId]
                  if (!checkpointId) {
                    throw new Error(
                      `No checkpoint is configured for POI interaction "${interactionId}" on "${poi.id}".`,
                    )
                  }
                  completeCheckpoint(module.id, checkpointId)
                }}
              />
            ),
          },
        ]
      }) ?? [],
    [
      moduleMap,
      module.id,
      module.translationNamespace,
      completedCheckpoints,
      completeCheckpoint,
      i18n,
      language,
    ],
  )

  return (
    <main className="relative h-dvh w-full overflow-hidden">
      <AlbertaMap
        key={module.id}
        ariaLabel={t('moduleMapLabel', { moduleName })}
        moduleId={module.id}
        modulePois={modulePois}
        defaultPoisVisible={moduleMap?.settings.defaultPoisVisible}
        modulePoisVisible={moduleMap?.settings.modulePoisVisible}
        moduleStartup={moduleMap?.settings.startup}
      >
        <MapControls />
        <ModuleTitleBar
          key={module.id}
          title={moduleName}
          description={tModule('description')}
          progress={getExpeditionProgress(module)}
        />
        <MapActionControls />
        <ExploreMapNavBar
          moduleId={module.id}
          activityPath={
            module.activityPage ? getModuleActivityPath(module.id) : undefined
          }
        />
      </AlbertaMap>
    </main>
  )
}
