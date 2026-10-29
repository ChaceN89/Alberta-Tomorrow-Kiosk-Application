/**
  File: useExpeditionProgress.ts | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Define the shared interface for reading and updating saved expedition progress.

  Usage:
  - Use within ExpeditionProgressProvider from modules, journal UI, or shared UI.

  Notes:
  - None.
 */
import { createContext, useContext } from 'react'
import type { LearningModule } from '@/modules/types'
import type {
  ExpeditionProgress,
  ExpeditionProgressChange,
  ExpeditionProgressData,
} from './types'

// Define the shape of the expedition progress context value.
export type ExpeditionProgressContextValue = {
  progress: ExpeditionProgressData
  isStorageAvailable: boolean
  subscribeToChanges: (
    listener: (change: ExpeditionProgressChange) => void,
  ) => () => void
  startExpedition: (moduleId: string) => void
  completeCheckpoint: (moduleId: string, checkpointId: string) => void
  isCheckpointComplete: (moduleId: string, checkpointId: string) => boolean
  getCompletedCheckpoints: (moduleId: string) => readonly string[]
  getExpeditionProgress: (module: LearningModule) => ExpeditionProgress
  resetExpeditionProgress: () => void
  startAllExpeditions: () => void
  progressNextCheckpoint: (moduleId: string) => boolean
  progressAllNextCheckpoints: () => number
  completeModule: (moduleId: string) => boolean
  randomizeModuleCheckpoints: (moduleId: string) => boolean
  restartModule: (moduleId: string) => boolean
  completeAllModules: () => void
}

// Create the expedition progress context with a default value of null.
export const ExpeditionProgressContext =
  createContext<ExpeditionProgressContextValue | null>(null)

// Read the expedition progress context or report a missing provider.
export function useExpeditionProgress() {
  const context = useContext(ExpeditionProgressContext)

  if (!context) {
    throw new Error(
      'useExpeditionProgress must be used within an ExpeditionProgressProvider.',
    )
  }

  return context
}
