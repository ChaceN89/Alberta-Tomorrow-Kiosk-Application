/**
  File: useModulePreload.ts | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 23, 2026

  Description:
  - Define the module preload context and consumer hook.

  Usage:
  - Module support files are imported by module flows.

  Notes:
  - None.
 */
import { createContext, useContext } from 'react'
import type { LearningModule } from './types'

export type ModulePreloadStatus = 'idle' | 'loading' | 'ready' | 'error'

export type ModulePreloadState = {
  moduleId: string | null
  status: ModulePreloadStatus
  progress: number
}

type ModulePreloadContextValue = {
  state: ModulePreloadState
  preloadModule: (module: LearningModule) => Promise<boolean>
  cancelPreload: () => void
  isModuleReady: (moduleId: string) => boolean
}

export const ModulePreloadContext =
  createContext<ModulePreloadContextValue | null>(null)

export function useModulePreload() {
  const context = useContext(ModulePreloadContext)

  if (!context) {
    throw new Error(
      'useModulePreload must be used within a ModulePreloadProvider.',
    )
  }

  return context
}
