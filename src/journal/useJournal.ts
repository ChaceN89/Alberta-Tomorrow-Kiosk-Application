/**
 * File: useJournal.ts | Author: Chace Nielson
 * Created: 2026-10-23 | Updated: 2026-10-23
 * Description: Define the expedition journal context and consumer hook.
 * Dependencies: React context, learning-module registry types.
 */
import { createContext, useContext } from 'react'
import type { LearningModule } from '../modules/types'

export type ExpeditionStatus = 'notStarted' | 'inProgress' | 'complete'

export type ExpeditionProgress = {
  completed: number
  total: number
  status: ExpeditionStatus
}

type JournalContextValue = {
  isOpen: boolean
  activeModuleId: string | null
  isStorageAvailable: boolean
  openJournal: (moduleId?: string) => void
  closeJournal: () => void
  // Passing null selects the journal's title page.
  selectExpedition: (moduleId: string | null) => void
  startExpedition: (moduleId: string) => void
  completeCheckpoint: (moduleId: string, checkpointId: string) => void
  isCheckpointComplete: (moduleId: string, checkpointId: string) => boolean
  getCompletedCheckpoints: (moduleId: string) => readonly string[]
  getExpeditionProgress: (module: LearningModule) => ExpeditionProgress
  resetJournal: () => void
}

export const JournalContext = createContext<JournalContextValue | null>(null)

export function useJournal() {
  const context = useContext(JournalContext)

  if (!context) {
    throw new Error('useJournal must be used within a JournalProvider.')
  }

  return context
}
