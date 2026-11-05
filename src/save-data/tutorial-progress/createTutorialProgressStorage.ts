/**
  File: createTutorialProgressStorage.ts | Author: Chace Nielson
  Date Created: Nov 5, 2026
  Date Updated: Nov 5, 2026

  Description:
  - Share the local-storage completion flag behavior used by individual tutorials.

  Usage:
  - Create a storage adapter with a tutorial-specific key and optional event name.

  Notes:
  - Storage failures leave the tutorial usable for the current page load.
 */
type TutorialProgressStorage = {
  hasCompleted: () => boolean
  markCompleted: () => void
  reset: () => void
}

export function createTutorialProgressStorage(
  storageKey: string,
  storageEventName?: string,
): TutorialProgressStorage {
  const dispatchStorageEvent = () => {
    if (storageEventName) {
      window.dispatchEvent(new Event(storageEventName))
    }
  }

  return {
    hasCompleted() {
      try {
        return window.localStorage.getItem(storageKey) === 'true'
      } catch {
        return false
      }
    },
    markCompleted() {
      try {
        window.localStorage.setItem(storageKey, 'true')
        dispatchStorageEvent()
      } catch {
        // The tutorial still ends for this page load if browser storage is unavailable.
      }
    },
    reset() {
      try {
        window.localStorage.removeItem(storageKey)
      } catch {
        // Storage may be unavailable.
      }
      dispatchStorageEvent()
    },
  }
}
