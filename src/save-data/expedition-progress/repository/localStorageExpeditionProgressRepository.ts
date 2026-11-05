/**
  File: localStorageExpeditionProgressRepository.ts | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Nov 5, 2026

  Description:
  - Implement the progress repository with browser localStorage.

  Usage:
  - The progress provider uses this adapter by default.

  Notes:
  - Persisted data is intentionally resettable; no legacy format migration is included.
 */
import type { ExpeditionProgressData } from '../types'
import type {
  ExpeditionProgressLoadResult,
  ExpeditionProgressRepository,
} from './ExpeditionProgressRepository'

//
const STORAGE_KEY = 'alberta-tomorrow:expedition-progress'
const PREVIOUS_STORAGE_KEY = 'alberta-expeditions:journal'
const STORAGE_VERSION = 1

// Check whether parsed storage data is a non-array object.
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

// Keep only checkpoint entries whose saved timestamps are strings.
function parseCheckpoints(value: unknown): Record<string, string> {
  if (!isRecord(value)) return {}

  // Filter out checkpoint entries whose timestamps are not strings.
  return Object.fromEntries(
    Object.entries(value).filter(
      (entry): entry is [string, string] => typeof entry[1] === 'string',
    ),
  )
}

// Parse and validate the versioned expedition progress payload.
function parseProgress(raw: string): ExpeditionProgressData {
  let parsed: unknown

  // attempt to parse the raw JSON string
  try {
    parsed = JSON.parse(raw)
  } catch {
    return {}
  }

  // validate the parsed structure and version and in case of any mismatch, return an empty object.
  if (
    !isRecord(parsed) ||
    parsed.version !== STORAGE_VERSION ||
    !isRecord(parsed.expeditions)
  ) {
    return {}
  }

  // empty object to accumulate validated expedition progress entries.
  const progress: ExpeditionProgressData = {}

  // loop through each module's saved expedition data and validate it.
  for (const [moduleId, saved] of Object.entries(parsed.expeditions)) {
    if (!isRecord(saved) || typeof saved.startedAt !== 'string') continue

    progress[moduleId] = {
      startedAt: saved.startedAt,
      checkpoints: parseCheckpoints(saved.checkpoints),
    }
  }

  return progress
}

// Load and validate expedition progress from localStorage.
function loadExpeditionProgress(): ExpeditionProgressLoadResult {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)

    return { progress: raw ? parseProgress(raw) : {}, isAvailable: true }
  } catch {
    return { progress: {}, isAvailable: false }
  }
}

// Serialize and save expedition progress to localStorage.
function saveExpeditionProgress(progress: ExpeditionProgressData): boolean {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: STORAGE_VERSION, expeditions: progress }),
    )
    return true
  } catch {
    return false
  }
}

// Remove current and previous expedition progress storage keys.
function clearExpeditionProgressStorage(): boolean {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
    window.localStorage.removeItem(PREVIOUS_STORAGE_KEY)
    return true
  } catch {
    return false
  }
}

export const localStorageExpeditionProgressRepository: ExpeditionProgressRepository =
  {
    load: async () => loadExpeditionProgress(),
    save: async (progress) => saveExpeditionProgress(progress),
    clear: async () => clearExpeditionProgressStorage(),
  }
