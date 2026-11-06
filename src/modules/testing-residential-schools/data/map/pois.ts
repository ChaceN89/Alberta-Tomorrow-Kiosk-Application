/**
  File: pois.ts | Author: Chace Nielson
  Date Created: Nov 6, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Define residential-school POI locations and their completion requirements.

  Usage:
  - Combined with map settings and POI content by the module definition.

  Notes:
  - Coordinates use longitude, latitude order.
 */
import type { ModuleMapPoi } from '@/modules/types'
import {
  lesserSlaveLakeAudioFinishedCheckpoint,
  lesserSlaveLakeSchoolPoiSelectedCheckpoint,
  stAlbertYouvilleMessageOpenedCheckpoint,
  stAlbertYouvilleSchoolPoiSelectedCheckpoint,
  stAlbertYouvilleVideoFinishedCheckpoint,
  stMarysBloodSchoolPoiSelectedCheckpoint,
  stMarysBloodSchoolAudioFinishedCheckpoint,
  stMarysBloodSchoolPhotoViewedCheckpoint,
} from '../../journal/checkpoints'

export const residentialSchoolMapPois = [
  {
    id: 'st-marys-blood',
    checkpointId: stMarysBloodSchoolPoiSelectedCheckpoint,
    coordinates: [-113.45, 49.2],
    titleKey: 'activity.schools.st-marys-blood.name',
    // need all these activity checkpoint done for the checkmark on the st-marys-blood to appear
    additionalCompletionCheckpoints: [
      stMarysBloodSchoolPhotoViewedCheckpoint,
      stMarysBloodSchoolAudioFinishedCheckpoint,
    ],
  },
  {
    id: 'st-albert-youville',
    checkpointId: stAlbertYouvilleSchoolPoiSelectedCheckpoint,
    coordinates: [-113.625, 53.63],
    titleKey: 'activity.schools.st-albert-youville.name',
    additionalCompletionCheckpoints: [
      stAlbertYouvilleVideoFinishedCheckpoint,
      stAlbertYouvilleMessageOpenedCheckpoint,
    ],
  },
  {
    id: 'lesser-slave-lake',
    checkpointId: lesserSlaveLakeSchoolPoiSelectedCheckpoint,
    coordinates: [-116.126, 55.515],
    titleKey: 'activity.schools.lesser-slave-lake.name',
    additionalCompletionCheckpoints: [lesserSlaveLakeAudioFinishedCheckpoint],
  },
] as const satisfies readonly ModuleMapPoi[]
