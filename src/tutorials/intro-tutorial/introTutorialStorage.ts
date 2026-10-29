/**
  File: introTutorialStorage.ts | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Remember in browser localStorage whether the first-visit tutorial was finished.

  Usage:
  - Tutorial internals serve their providers or components.

  Notes:
  - None.
 */
const STORAGE_KEY = 'alberta-expeditions:intro-tutorial-completed'

export function hasCompletedIntroTutorial(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    // Without storage every visit looks like a first visit.
    return false
  }
}

export function markIntroTutorialCompleted() {
  try {
    window.localStorage.setItem(STORAGE_KEY, 'true')
  } catch {
    // Ignore storage failures; the tutorial still ends for this page load.
  }
}

export function resetIntroTutorial() {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Ignore storage failures.
  }
}
