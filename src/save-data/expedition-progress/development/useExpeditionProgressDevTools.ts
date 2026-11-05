/**
  File: useExpeditionProgressDevTools.ts | Author: Chace Nielson
  Date Created: Nov 5, 2026
  Date Updated: Nov 5, 2026

  Description:
  - Expose reset and simulated progress actions to development UI.

  Usage:
  - Use only from development panels and preview tools.

  Notes:
  - Kept separate from useExpeditionProgress so app consumers see only learner actions.
 */
import { createContext, useContext } from 'react'

export type ExpeditionProgressDevToolsContextValue = {
  resetExpeditionProgress: () => Promise<void>
  startAllExpeditions: () => void
  progressNextCheckpoint: (moduleId: string) => boolean
  progressAllNextCheckpoints: () => number
  completeModule: (moduleId: string) => boolean
  randomizeModuleCheckpoints: (moduleId: string) => boolean
  restartModule: (moduleId: string) => boolean
  completeAllModules: () => void
}

export const ExpeditionProgressDevToolsContext =
  createContext<ExpeditionProgressDevToolsContextValue | null>(null)

export function useExpeditionProgressDevTools() {
  const context = useContext(ExpeditionProgressDevToolsContext)

  if (!context) {
    throw new Error(
      'useExpeditionProgressDevTools must be used within an ExpeditionProgressProvider.',
    )
  }

  return context
}
