/**
  File: ModuleExploreMap.tsx | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Show the Alberta map with information for the selected module.

  Usage:
  - Rendered at /expeditions/:moduleId/explore.

  Notes:
  - Module POI descriptions use translated, authored React content.
 */
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useExpeditionProgress } from '@/save-data/useExpeditionProgress'
import type { LearningModule } from '@/modules/types'
import type { MapPoi } from './components/MapPoiMarker'
import stMarysLandscape from '@/modules/testing-residential-schools/assets/st-marys-landscape.jpg'
import stAlbertRiverValley from '@/modules/testing-residential-schools/assets/st-albert-river-valley.jpg'
import lesserSlaveLakeLandscape from '@/modules/testing-residential-schools/assets/lesser-slave-lake.jpg'
import { ResidentialSchoolPoiInfo } from '@/modules/testing-residential-schools/ResidentialSchoolPoiInfo'
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
  const { t: tResidentialSchool } = useTranslation('residentialSchool')
  const { startExpedition, completeCheckpoint, getCompletedCheckpoints } =
    useExpeditionProgress()
  const moduleName = tModule('title')
  const moduleMap = module.map
  const completedCheckpoints = getCompletedCheckpoints(module.id)
  const schools =
    module.translationNamespace === 'residentialSchool'
      ? tResidentialSchool('activity.schools', { returnObjects: true })
      : []
  const schoolImages: Readonly<Record<string, string>> = {
    'st-marys-blood': stMarysLandscape,
    'st-albert-youville': stAlbertRiverValley,
    'lesser-slave-lake': lesserSlaveLakeLandscape,
  }

  useEffect(() => {
    startExpedition(module.id)
  }, [module.id, startExpedition])

  const modulePois: MapPoi[] =
    moduleMap?.pois.flatMap((poi) => {
      const school = schools.find((entry) => entry.id === poi.id)
      const image = schoolImages[poi.id]
      if (!school || !image) return []

      return [
        {
          id: poi.id,
          coordinates: poi.coordinates,
          title: school.name,
          isComplete:
            completedCheckpoints.includes(poi.id) &&
            (poi.additionalCompletionCheckpoints ?? []).every((checkpointId) =>
              completedCheckpoints.includes(checkpointId),
            ),
          onActivate: () => completeCheckpoint(module.id, poi.id),
          info: (
            <ResidentialSchoolPoiInfo
              school={school}
              schoolImage={image}
              onComplete={(checkpointId) =>
                completeCheckpoint(module.id, checkpointId)
              }
            />
          ),
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
        defaultPoisVisible={moduleMap?.defaultPoisVisible}
        modulePoisVisible={moduleMap?.modulePoisVisible}
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
