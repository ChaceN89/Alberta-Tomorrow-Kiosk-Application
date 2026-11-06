/**
  File: checkpoints.ts | Author: Chace Nielson
  Date Created: Nov 6, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Define every residential-schools checkpoint id and its journal ordering.

  Usage:
  - Map and media data import these constants.

  Notes:
  - POI ids are distinct from the checkpoint ids used for saved completion.
 */
export const stMarysBloodSchoolPoiSelectedCheckpoint =
  'residential-schools-st-marys-blood-poi-selected'
export const stMarysBloodSchoolPhotoViewedCheckpoint =
  'residential-schools-st-marys-blood-photo-viewed'
export const stMarysBloodSchoolAudioFinishedCheckpoint =
  'residential-schools-st-marys-blood-audio-finished'
export const stAlbertYouvilleSchoolPoiSelectedCheckpoint =
  'residential-schools-st-albert-youville-poi-selected'
export const stAlbertYouvilleVideoFinishedCheckpoint =
  'residential-schools-st-albert-youville-video-finished'
export const stAlbertYouvilleMessageOpenedCheckpoint =
  'residential-schools-st-albert-youville-message-opened'
export const lesserSlaveLakeSchoolPoiSelectedCheckpoint =
  'residential-schools-lesser-slave-lake-poi-selected'
export const lesserSlaveLakeAudioFinishedCheckpoint =
  'residential-schools-lesser-slave-lake-audio-finished'

export const residentialSchoolCheckpoints = [
  stMarysBloodSchoolPoiSelectedCheckpoint,
  stMarysBloodSchoolPhotoViewedCheckpoint,
  stMarysBloodSchoolAudioFinishedCheckpoint,
  stAlbertYouvilleSchoolPoiSelectedCheckpoint,
  stAlbertYouvilleVideoFinishedCheckpoint,
  stAlbertYouvilleMessageOpenedCheckpoint,
  lesserSlaveLakeSchoolPoiSelectedCheckpoint,
  lesserSlaveLakeAudioFinishedCheckpoint,
] as const
