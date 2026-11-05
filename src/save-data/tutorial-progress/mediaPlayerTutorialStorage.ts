/**
  File: mediaPlayerTutorialStorage.ts | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Nov 5, 2026

  Description:
  - Persist whether the first-use media player tutorial has been completed.

  Usage:
  - The media player tutorial feature and development tools use these functions.

  Notes:
  - This is a separate local tutorial flag, not expedition progress.
 */
import { createTutorialProgressStorage } from './createTutorialProgressStorage'

const mediaPlayerTutorialStorage = createTutorialProgressStorage(
  'alberta-expeditions:media-player-tutorial-completed',
)

export function hasCompletedMediaPlayerTutorial() {
  return mediaPlayerTutorialStorage.hasCompleted()
}

export function markMediaPlayerTutorialCompleted() {
  mediaPlayerTutorialStorage.markCompleted()
}

export function resetMediaPlayerTutorial() {
  mediaPlayerTutorialStorage.reset()
}
