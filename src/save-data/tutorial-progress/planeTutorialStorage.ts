import { createTutorialProgressStorage } from './createTutorialProgressStorage'

/**
  File: planeTutorialStorage.ts | Author: Chace Nielson
  Date Created: Nov 5, 2026
  Date Updated: Nov 5, 2026

  Description:
  - Persist whether the learner has completed the first-flight tutorial.

  Usage:
  - Used by AlbertaMap and developer tutorial tools.

  Notes:
  - This is a separate local tutorial flag, not expedition progress.
 */
export const PLANE_TUTORIAL_STORAGE_EVENT =
  'alberta-expeditions:plane-tutorial-storage'

const planeTutorialStorage = createTutorialProgressStorage(
  'alberta-expeditions:plane-tutorial-completed',
  PLANE_TUTORIAL_STORAGE_EVENT,
)

export function hasCompletedPlaneTutorial() {
  return planeTutorialStorage.hasCompleted()
}

export function markPlaneTutorialCompleted() {
  planeTutorialStorage.markCompleted()
}

export function resetPlaneTutorial() {
  planeTutorialStorage.reset()
}
