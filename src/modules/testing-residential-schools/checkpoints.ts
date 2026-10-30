/**
  File: checkpoints.ts | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Journal checkpoint ids for the residential-school expedition.

  Usage:
  - Module data files are used by their activity.

  Notes:
   - Ids match residential-school map POIs, media interactions, and journal entries.
 */
export const bloodSchoolPhotoCheckpoint = 'st-marys-blood-photo-viewed'
export const bloodSchoolAudioCheckpoint = 'st-marys-blood-audio-finished'
export const stAlbertVideoCheckpoint = 'st-albert-youville-video-finished'
export const stAlbertMessageCheckpoint = 'st-albert-youville-message-opened'
export const lesserSlaveLakeAudioCheckpoint = 'lesser-slave-lake-audio-finished'

export const residentialSchoolCheckpoints = [
  'st-marys-blood',
  bloodSchoolPhotoCheckpoint,
  bloodSchoolAudioCheckpoint,
  'st-albert-youville',
  stAlbertVideoCheckpoint,
  stAlbertMessageCheckpoint,
  'lesser-slave-lake',
  lesserSlaveLakeAudioCheckpoint,
] as const
