/**
  File: checkpoints.ts | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Define every wildlife checkpoint id and its journal ordering.

  Usage:
  - Activity and media data import these constants.

  Notes:
  - Keep each id aligned with its localized journal entry.
 */
export const foxSongStartedCheckpoint = 'foxes-of-alberta-song-started'
export const foxSongFinishedCheckpoint = 'foxes-of-alberta-song-finished'
export const foxNarrationFinishedCheckpoint =
  'foxes-of-alberta-narration-finished'
export const foxRedFoxSoundStartedCheckpoint =
  'foxes-red-fox-sound-recording-started'
export const foxesVideoFinishedCheckpoint = 'foxes-video-finished'
export const foxFieldMessageCheckpoint = 'fox-field-message-opened'
export const foxFieldListCheckpoint = 'fox-field-list-opened'
export const foxFamilyImageCheckpoint = 'fox-family-image-opened'
export const swiftFoxHabitatQuizQuestionCheckpoint =
  'foxes-quiz-swift-fox-habitat-answered'
export const redFoxDietQuizQuestionCheckpoint =
  'foxes-quiz-red-fox-diet-answered'
export const redFoxSoundQuizQuestionCheckpoint =
  'foxes-quiz-red-fox-sound-answered'

export const foxesOfAlbertaCheckpoints = [
  foxSongStartedCheckpoint,
  foxSongFinishedCheckpoint,
  foxNarrationFinishedCheckpoint,
  foxRedFoxSoundStartedCheckpoint,
  foxesVideoFinishedCheckpoint,
  foxFieldMessageCheckpoint,
  foxFieldListCheckpoint,
  foxFamilyImageCheckpoint,
  swiftFoxHabitatQuizQuestionCheckpoint,
  redFoxDietQuizQuestionCheckpoint,
  redFoxSoundQuizQuestionCheckpoint,
] as const
