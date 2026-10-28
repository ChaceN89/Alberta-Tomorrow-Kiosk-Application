/**
  File: introTourStorage.ts | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 23, 2026

  Description:
  - Remember in browser localStorage whether the first-visit tour was finished.

  Usage:
  - Journal and intro-tour internals serve their providers or components.

  Notes:
  - None.
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
