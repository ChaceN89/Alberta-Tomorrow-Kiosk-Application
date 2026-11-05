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
const STORAGE_KEY = 'alberta-expeditions:plane-tutorial-completed'
export const PLANE_TUTORIAL_STORAGE_EVENT =
  'alberta-expeditions:plane-tutorial-storage'

export function hasCompletedPlaneTutorial(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

export function markPlaneTutorialCompleted() {
  try {
    window.localStorage.setItem(STORAGE_KEY, 'true')
    window.dispatchEvent(new Event(PLANE_TUTORIAL_STORAGE_EVENT))
  } catch {
    // The tutorial still ends for this page load if browser storage is unavailable.
  }
}

export function resetPlaneTutorial() {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Storage may be unavailable.
  }
  window.dispatchEvent(new Event(PLANE_TUTORIAL_STORAGE_EVENT))
}
