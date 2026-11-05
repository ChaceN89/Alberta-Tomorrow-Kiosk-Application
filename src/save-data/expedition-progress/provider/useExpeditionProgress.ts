/**
  File: useExpeditionProgress.ts | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Nov 5, 2026

  Description:
  - Define the shared interface for reading and updating saved expedition progress.

  Usage:
  - Use within ExpeditionProgressProvider from modules, journal UI, or shared UI.

  Notes:
  - Exposes learner-facing progress operations; developer mutations use a separate hook.
 */
import { createContext, useContext } from 'react'
import type { LearningModule } from '@/modules/types'
import type {
  ExpeditionProgress,
  ExpeditionProgressChange,
  ExpeditionProgressData,
} from '../types'

// Define the shape of the expedition progress context value.
export type ExpeditionProgressContextValue = {
  progress: ExpeditionProgressData
  isStorageAvailable: boolean
  subscribeToChanges: (
    listener: (change: ExpeditionProgressChange) => void,
  ) => () => void
  startExpedition: (moduleId: string) => void // Mark the start of an expedition for the given module.
  completeCheckpoint: (moduleId: string, checkpointId: string) => void // Mark the specified checkpoint as complete for the given module.
  isCheckpointComplete: (moduleId: string, checkpointId: string) => boolean // Check if the specified checkpoint is complete for the given module.
  getCompletedCheckpoints: (moduleId: string) => readonly string[] // Get a list of completed checkpoints for the given module.
  getExpeditionProgress: (module: LearningModule) => ExpeditionProgress // Get the overall expedition progress for the given module.
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
