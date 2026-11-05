import { createTutorialProgressStorage } from './createTutorialProgressStorage'

/**
  File: introToMapTutorialStorage.ts | Author: Chace Nielson
  Date Created: Nov 5, 2026
  Date Updated: Nov 5, 2026

  Description:
  - Persist whether the learner has completed the first-visit map tutorial.

  Usage:
  - Used by ExploreMapTutorial and developer tutorial tools.

  Notes:
  - This is a separate local tutorial flag, not expedition progress.
 */
export const INTRO_TO_MAP_TUTORIAL_STORAGE_EVENT =
  'alberta-expeditions:intro-to-map-tutorial-storage'

const introToMapTutorialStorage = createTutorialProgressStorage(
  'alberta-expeditions:intro-to-map-tutorial-completed',
  INTRO_TO_MAP_TUTORIAL_STORAGE_EVENT,
)

export function hasCompletedIntroToMapTutorial() {
  return introToMapTutorialStorage.hasCompleted()
}

export function markIntroToMapTutorialCompleted() {
  introToMapTutorialStorage.markCompleted()
}

export function resetIntroToMapTutorial() {
  introToMapTutorialStorage.reset()
}
