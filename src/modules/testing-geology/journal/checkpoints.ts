/**
  File: checkpoints.ts | Author: Chace Nielson
  Date Created: Nov 6, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Define every geology checkpoint id and its journal ordering.

  Usage:
  - Activity and quiz data import these constants.

  Notes:
  - Keep each id aligned with its localized journal entry.
 */
export const geologyNaturalLandscapesVideoStartedCheckpoint =
  'geology-natural-landscapes-video-started'
export const geologyOilBarrelModelViewedCheckpoint =
  'geology-oil-barrel-model-viewed'
export const geologyQuizCompletedCheckpoint = 'geology-quiz-completed'
export const badlandsQuizQuestionCheckpoint =
  'geology-quiz-badlands-question-answered'
export const glacialBoulderQuizQuestionCheckpoint =
  'geology-quiz-glacial-boulder-question-answered'
export const oilSandsQuizQuestionCheckpoint =
  'geology-quiz-oil-sands-question-answered'

export const geologyCheckpoints = [
  geologyOilBarrelModelViewedCheckpoint,
  geologyNaturalLandscapesVideoStartedCheckpoint,
  geologyQuizCompletedCheckpoint,
  badlandsQuizQuestionCheckpoint,
  glacialBoulderQuizQuestionCheckpoint,
  oilSandsQuizQuestionCheckpoint,
] as const
