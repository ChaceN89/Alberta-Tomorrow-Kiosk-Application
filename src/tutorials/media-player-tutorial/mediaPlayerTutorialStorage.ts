/**
  File: mediaPlayerTutorialStorage.ts | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Remember whether the first-use media player tutorial has been completed.

  Usage:
  - MediaPlayerTutorial and development tools manage this flag.

  Notes:
  - The tutorial can still be skipped when browser storage is unavailable.
 */
const STORAGE_KEY = 'alberta-expeditions:media-player-tutorial-completed'

export function hasCompletedMediaPlayerTutorial(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

export function markMediaPlayerTutorialCompleted() {
  try {
    window.localStorage.setItem(STORAGE_KEY, 'true')
  } catch {
    // The tutorial still ends for this page load if browser storage is unavailable.
  }
}

export function resetMediaPlayerTutorial() {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // The next page load will still be able to run the tutorial when storage is available.
  }
}
