/**
  File: mediaPlayerTutorialStorage.ts | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Persist whether the first-use media player tutorial has been completed.

  Usage:
  - The media player tutorial feature and development tools use these functions.

  Notes:
  - None.
 */
const STORAGE_KEY = 'alberta-expeditions:media-player-tutorial-completed'

// Check whether the media player tutorial has been completed.
export function hasCompletedMediaPlayerTutorial(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

// Save that the media player tutorial has been completed.
export function markMediaPlayerTutorialCompleted() {
  try {
    window.localStorage.setItem(STORAGE_KEY, 'true')
  } catch {
    // The tutorial still ends for this page load if browser storage is unavailable.
  }
}

// Clear the saved media player tutorial completion flag.
export function resetMediaPlayerTutorial() {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Storage may be unavailable.
  }
}
