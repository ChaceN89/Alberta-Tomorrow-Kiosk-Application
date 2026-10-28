/**
 * File: introTourStorage.ts | Author: Chace Nielson
 * Created: 2026-10-23 | Updated: 2026-10-23
 * Description: Remember in browser localStorage whether the first-visit tour was finished.
 * Dependencies: Browser localStorage; a later settings screen can call resetIntroTour.
 */
const STORAGE_KEY = 'alberta-expeditions:intro-tour-completed'

export function hasCompletedIntroTour(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    // Without storage every visit looks like a first visit.
    return false
  }
}

export function markIntroTourCompleted() {
  try {
    window.localStorage.setItem(STORAGE_KEY, 'true')
  } catch {
    // Ignore storage failures; the tour still ends for this page load.
  }
}

export function resetIntroTour() {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Ignore storage failures.
  }
}
