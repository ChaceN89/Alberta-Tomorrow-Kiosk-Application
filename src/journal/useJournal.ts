/**
  File: useJournal.ts | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Define the expedition journal context and consumer hook.

  Usage:
  - Journal and intro-tour internals serve their providers or components.

  Notes:
  - None.
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
  startAllExpeditions: () => void
  completeAllModules: () => void
}

export const JournalContext = createContext<JournalContextValue | null>(null)

export function useJournal() {
  const context = useContext(JournalContext)

  if (!context) {
    throw new Error('useJournal must be used within a JournalProvider.')
  }

  return context
}
