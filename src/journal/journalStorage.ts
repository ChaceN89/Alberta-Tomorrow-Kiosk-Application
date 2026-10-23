/**
 * File: journalStorage.ts | Author: Chace Nielson
 * Created: 2026-10-23 | Updated: 2026-10-23
 * Description: Read and write expedition journal progress in browser localStorage.
 * Dependencies: Browser localStorage; swap this module for save-data sync later.
 */
const STORAGE_KEY = 'alberta-expeditions:journal'
const STORAGE_VERSION = 2

export type ExpeditionRecord = {
  // When the expedition was started; its presence adds it to the journal.
  startedAt: string
  // Maps checkpoint id -> ISO timestamp when it was recorded.
  checkpoints: Record<string, string>
}

// Maps expedition id -> its saved record.
export type JournalProgress = Record<string, ExpeditionRecord>

type LoadedJournal = {
  progress: JournalProgress
  isAvailable: boolean
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function parseCheckpoints(value: unknown): Record<string, string> {
  if (!isRecord(value)) return {}

  return Object.fromEntries(
    Object.entries(value).filter(
      (entry): entry is [string, string] => typeof entry[1] === 'string',
    ),
  )
}

function parseProgress(raw: string): JournalProgress {
  let parsed: unknown

  try {
    parsed = JSON.parse(raw)
  } catch {
    return {}
  }

  if (!isRecord(parsed) || !isRecord(parsed.expeditions)) {
    return {}
  }

  const progress: JournalProgress = {}

  for (const [expeditionId, saved] of Object.entries(parsed.expeditions)) {
    if (parsed.version === 1) {
      // Version 1 stored only checkpoints; any recorded checkpoint means started.
      const checkpoints = parseCheckpoints(saved)
      const [earliest] = Object.values(checkpoints).sort()

      if (earliest) {
        progress[expeditionId] = { startedAt: earliest, checkpoints }
      }
    } else if (
      parsed.version === STORAGE_VERSION &&
      isRecord(saved) &&
      typeof saved.startedAt === 'string'
    ) {
      progress[expeditionId] = {
        startedAt: saved.startedAt,
        checkpoints: parseCheckpoints(saved.checkpoints),
      }
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
