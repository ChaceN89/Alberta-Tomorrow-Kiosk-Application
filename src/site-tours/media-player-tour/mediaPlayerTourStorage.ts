/**
  File: mediaPlayerTourStorage.ts | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Remember whether the first-use media player tour has been completed.

  Usage:
  - MediaPlayerTour and development tools manage this flag.

  Notes:
  - The tour can still be skipped when browser storage is unavailable.
 */
const STORAGE_KEY = 'alberta-expeditions:media-player-tour-completed'

export function hasCompletedMediaPlayerTour(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

export function markMediaPlayerTourCompleted() {
  try {
    window.localStorage.setItem(STORAGE_KEY, 'true')
  } catch {
    // The tour still ends for this page load if browser storage is unavailable.
  }
}

export function resetMediaPlayerTour() {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // The next page load will still be able to run the tour when storage is available.
  }
}
