/**
 * File: journalStorage.ts | Author: Chace Nielson
 * Created: 2026-10-23 | Updated: 2026-10-23
 * Description: Read and write expedition journal progress in browser localStorage.
 * Dependencies: Browser localStorage; swap this module for save-data sync later.
 */
const STORAGE_KEY = 'alberta-expeditions:journal'
const STORAGE_VERSION = 1

// Maps expedition id -> checkpoint id -> ISO timestamp when it was recorded.
export type JournalProgress = Record<string, Record<string, string>>

type LoadedJournal = {
  progress: JournalProgress
  isAvailable: boolean
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function parseProgress(raw: string): JournalProgress {
  let parsed: unknown

  try {
    parsed = JSON.parse(raw)
  } catch {
    return {}
  }

  if (
    !isRecord(parsed) ||
    parsed.version !== STORAGE_VERSION ||
    !isRecord(parsed.expeditions)
  ) {
    return {}
  }

  const progress: JournalProgress = {}

  for (const [expeditionId, checkpoints] of Object.entries(
    parsed.expeditions,
  )) {
    if (!isRecord(checkpoints)) continue

    const recorded = Object.entries(checkpoints).filter(
      (entry): entry is [string, string] => typeof entry[1] === 'string',
    )

    if (recorded.length > 0) {
      progress[expeditionId] = Object.fromEntries(recorded)
    }
  }

  return progress
}

export function loadJournal(): LoadedJournal {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)

    return { progress: raw ? parseProgress(raw) : {}, isAvailable: true }
  } catch {
    return { progress: {}, isAvailable: false }
  }
}

export function saveJournal(progress: JournalProgress): boolean {
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
