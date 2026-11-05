/**
  File: introTutorialStorage.ts | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Nov 5, 2026

  Description:
  - Persist whether the first-visit tutorial has been completed.

  Usage:
  - The intro tutorial feature and development tools use these functions.

  Notes:
  - This is a separate local tutorial flag, not expedition progress.
 */
import { createTutorialProgressStorage } from './createTutorialProgressStorage'

const introTutorialStorage = createTutorialProgressStorage(
  'alberta-expeditions:intro-tutorial-completed',
)

export function hasCompletedIntroTutorial() {
  return introTutorialStorage.hasCompleted()
}

export function markIntroTutorialCompleted() {
  introTutorialStorage.markCompleted()
}

export function resetIntroTutorial() {
  introTutorialStorage.reset()
}
