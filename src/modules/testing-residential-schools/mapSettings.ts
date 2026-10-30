/**
  File: mapSettings.ts | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Locate the three residential schools featured in the module.

  Usage:
  - Registered as the residential-schools module map configuration.

  Notes:
  - Coordinates use longitude, latitude order.
 */
import type { ModuleMapSettings } from '../types'
import {
  bloodSchoolAudioCheckpoint,
  bloodSchoolPhotoCheckpoint,
  lesserSlaveLakeAudioCheckpoint,
  stAlbertMessageCheckpoint,
  stAlbertVideoCheckpoint,
} from './checkpoints'

export const residentialSchoolMapSettings: ModuleMapSettings = {
  defaultPoisVisible: false,
  modulePoisVisible: true,
  pois: [
    {
      id: 'st-marys-blood',
      coordinates: [-113.45, 49.2],
      additionalCompletionCheckpoints: [
        bloodSchoolPhotoCheckpoint,
        bloodSchoolAudioCheckpoint,
      ],
    },
    {
      id: 'st-albert-youville',
      coordinates: [-113.625, 53.63],
      additionalCompletionCheckpoints: [
        stAlbertVideoCheckpoint,
        stAlbertMessageCheckpoint,
      ],
    },
    {
      id: 'lesser-slave-lake',
      coordinates: [-116.126, 55.515],
      additionalCompletionCheckpoints: [lesserSlaveLakeAudioCheckpoint],
    },
  ],
}
