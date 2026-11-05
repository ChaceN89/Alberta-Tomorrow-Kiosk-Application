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
const STORAGE_KEY = 'alberta-expeditions:intro-to-map-tutorial-completed'
export const INTRO_TO_MAP_TUTORIAL_STORAGE_EVENT =
  'alberta-expeditions:intro-to-map-tutorial-storage'

export function hasCompletedIntroToMapTutorial(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

export function markIntroToMapTutorialCompleted() {
  try {
    window.localStorage.setItem(STORAGE_KEY, 'true')
    window.dispatchEvent(new Event(INTRO_TO_MAP_TUTORIAL_STORAGE_EVENT))
  } catch {
    // The tutorial still ends for this page load if browser storage is unavailable.
  }
}

export function resetIntroToMapTutorial() {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Storage may be unavailable.
  }
  window.dispatchEvent(new Event(INTRO_TO_MAP_TUTORIAL_STORAGE_EVENT))
}
