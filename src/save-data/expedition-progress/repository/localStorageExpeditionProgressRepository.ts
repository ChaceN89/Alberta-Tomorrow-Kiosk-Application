/**
  File: localStorageExpeditionProgressRepository.ts | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Implement the progress repository with browser localStorage.

  Usage:
  - The progress provider uses this adapter by default.

  Notes:
  - Legacy checkpoint ids are migrated when progress is loaded.
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

  // Loop through each module's saved expedition data and validate it.
  for (const [moduleId, saved] of Object.entries(parsed.expeditions)) {
    if (!isRecord(saved) || typeof saved.startedAt !== 'string') continue

    progress[moduleId] = {
      startedAt: saved.startedAt,
      checkpoints: migrateCheckpointIds(
        moduleId,
        parseCheckpoints(saved.checkpoints),
      ),
    }
  }

  return progress
}

const LEGACY_CHECKPOINT_IDS: Readonly<
  Record<string, Readonly<Record<string, string | null>>>
> = {
  'testing-foxes-of-alberta': {
    'habitats-matter': null,
    'foxes-habitat-introduction-viewed': null,
    'audio-1-started': 'foxes-of-alberta-song-started',
    'audio-1-finished': 'foxes-of-alberta-song-finished',
    'audio-2-finished': 'foxes-of-alberta-narration-finished',
    'audio-3-started': 'foxes-red-fox-sound-recording-started',
    'swift-fox-home': 'foxes-quiz-swift-fox-habitat-answered',
    'red-fox-food': 'foxes-quiz-red-fox-diet-answered',
    'red-fox-sound-identification': 'foxes-quiz-red-fox-sound-answered',
  },
  'testing-geology': {
    'geology-video-started': 'geology-natural-landscapes-video-started',
    'geology-oil-barrel-viewed': 'geology-oil-barrel-model-viewed',
    badlands: 'geology-quiz-badlands-question-answered',
    'glacial-boulder': 'geology-quiz-glacial-boulder-question-answered',
    'oil-sands': 'geology-quiz-oil-sands-question-answered',
  },
  'testing-residential-schools': {
    'st-marys-blood': 'residential-schools-st-marys-blood-poi-selected',
    'st-marys-blood-photo-viewed':
      'residential-schools-st-marys-blood-photo-viewed',
    'st-marys-blood-audio-finished':
      'residential-schools-st-marys-blood-audio-finished',
    'st-albert-youville': 'residential-schools-st-albert-youville-poi-selected',
    'st-albert-youville-video-finished':
      'residential-schools-st-albert-youville-video-finished',
    'st-albert-youville-message-opened':
      'residential-schools-st-albert-youville-message-opened',
    'lesser-slave-lake': 'residential-schools-lesser-slave-lake-poi-selected',
    'lesser-slave-lake-audio-finished':
      'residential-schools-lesser-slave-lake-audio-finished',
  },
}

function migrateCheckpointIds(
  moduleId: string,
  checkpoints: Record<string, string>,
): Record<string, string> {
  const migrations = LEGACY_CHECKPOINT_IDS[moduleId]
  if (!migrations) return checkpoints

  const migrated = { ...checkpoints }

  for (const [oldId, currentId] of Object.entries(migrations)) {
    const timestamp = migrated[oldId]
    if (timestamp === undefined) continue

    if (currentId === null) {
      delete migrated[oldId]
      continue
    }

    migrated[currentId] ??= timestamp
    delete migrated[oldId]
  }

  return migrated
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
