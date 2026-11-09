/**
  File: pois.ts | Author: Chace Nielson
  Date Created: Nov 6, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Define residential-school POI locations and their completion requirements.

  Usage:
  - Combined with map settings by the module definition.

  Notes:
  - Coordinates use longitude, latitude order.
 */
import type { ModuleMapPoi } from '@/modules/types'
import { LesserSlaveLakeResidentialSchoolPoi } from './module-pois/LesserSlaveLakeResidentialSchoolPoi'
import { StAlbertYouvillePoi } from './module-pois/StAlbertYouvillePoi'
import { StMarysBloodPoi } from './module-pois/StMarysBloodPoi'
import {
  lesserSlaveLakeAudioFinishedCheckpoint,
  lesserSlaveLakeSchoolPoiSelectedCheckpoint,
  stAlbertYouvilleMessageOpenedCheckpoint,
  stAlbertYouvilleSchoolPoiSelectedCheckpoint,
  stAlbertYouvilleVideoFinishedCheckpoint,
  stMarysBloodSchoolPoiSelectedCheckpoint,
  stMarysBloodSchoolAudioFinishedCheckpoint,
  stMarysBloodSchoolPhotoViewedCheckpoint,
} from '../journal/checkpoints'

export const residentialSchoolMapPois = [
  {
    id: 'st-marys-blood',
    flyoverPoiFov: 37,
    infoContent: StMarysBloodPoi,
    coordinates: [-113.45, 49.2],
    titleKey: 'activity.schools.st-marys-blood.name',
    iconCategory: 'residentialSchool',
    poiSelectedCheckpointId: stMarysBloodSchoolPoiSelectedCheckpoint,
    additionalCompletionCheckpoints: [
      stMarysBloodSchoolPhotoViewedCheckpoint,
      stMarysBloodSchoolAudioFinishedCheckpoint,
    ],
    infoCheckpoints: {
      photoViewed: stMarysBloodSchoolPhotoViewedCheckpoint,
      audioFinished: stMarysBloodSchoolAudioFinishedCheckpoint,
    },
  },
  {
    id: 'st-albert-youville',
    flyoverPoiFov: 37,
    infoContent: StAlbertYouvillePoi,
    coordinates: [-113.625, 53.63],
    titleKey: 'activity.schools.st-albert-youville.name',
    iconCategory: 'residentialSchool',
    poiSelectedCheckpointId: stAlbertYouvilleSchoolPoiSelectedCheckpoint,
    additionalCompletionCheckpoints: [
      stAlbertYouvilleVideoFinishedCheckpoint,
      stAlbertYouvilleMessageOpenedCheckpoint,
    ],
    infoCheckpoints: {
      videoFinished: stAlbertYouvilleVideoFinishedCheckpoint,
      messageOpened: stAlbertYouvilleMessageOpenedCheckpoint,
    },
  },
  {
    id: 'lesser-slave-lake-residential-school',
    flyoverPoiFov: 37,
    infoContent: LesserSlaveLakeResidentialSchoolPoi,
    coordinates: [-116.126, 55.515],
    titleKey: 'activity.schools.lesser-slave-lake.name',
    iconCategory: 'residentialSchool',
    poiSelectedCheckpointId: lesserSlaveLakeSchoolPoiSelectedCheckpoint,
    additionalCompletionCheckpoints: [lesserSlaveLakeAudioFinishedCheckpoint],
    infoCheckpoints: {
      audioFinished: lesserSlaveLakeAudioFinishedCheckpoint,
    },
  },
] as const satisfies readonly ModuleMapPoi[]
