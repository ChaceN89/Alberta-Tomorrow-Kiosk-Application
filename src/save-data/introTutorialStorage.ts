/**
  File: introTutorialStorage.ts | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Persist whether the first-visit tutorial has been completed.

  Usage:
  - The intro tutorial feature and development tools use these functions.

  Notes:
  - None.
 */
const STORAGE_KEY = 'alberta-expeditions:intro-tutorial-completed'

// Check whether the first-visit tutorial has been completed.
export function hasCompletedIntroTutorial(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

// Save that the first-visit tutorial has been completed.
export function markIntroTutorialCompleted() {
  try {
    window.localStorage.setItem(STORAGE_KEY, 'true')
  } catch {
    // The tutorial still ends for this page load if browser storage is unavailable.
  }
}

// Clear the saved first-visit tutorial completion flag.
export function resetIntroTutorial() {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Storage may be unavailable.
  }
}
