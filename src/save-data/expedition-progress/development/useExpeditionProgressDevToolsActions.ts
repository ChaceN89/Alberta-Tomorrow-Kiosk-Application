/**
  File: useExpeditionProgressDevToolsActions.ts | Author: Chace Nielson
  Date Created: Nov 5, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Connect developer-only progress mutations to the provider's state callbacks.

  Usage:
  - Used only by ExpeditionProgressProvider to build the dev-tools context value.

  Notes:
  - Kept separate so learner-facing progress operations remain easy to identify.
 */
import { useCallback, useMemo } from 'react'
import type { ExpeditionProgressData } from '../types'
import type { CommitProgress, NotifyProgressChange } from '../actions/types'
import * as developmentActions from './index'
import type { ExpeditionProgressDevToolsContextValue } from './useExpeditionProgressDevTools'

type ExpeditionProgressRef = {
  current: ExpeditionProgressData
}

type UseExpeditionProgressDevToolsActionsOptions = {
  progressRef: ExpeditionProgressRef
  commitProgress: CommitProgress
  completeCheckpoint: (moduleId: string, checkpointId: string) => void
  notifyChange: NotifyProgressChange
  clearProgress: () => Promise<boolean>
  resetProgress: (isAvailable: boolean) => void
}

export function useExpeditionProgressDevToolsActions({
  progressRef,
  commitProgress,
  completeCheckpoint,
  notifyChange,
  clearProgress,
  resetProgress,
}: UseExpeditionProgressDevToolsActionsOptions) {
  // Reset both saved data and the provider's in-memory snapshot.
  const resetExpeditionProgress = useCallback(
    () =>
      developmentActions.resetExpeditionProgress(clearProgress, resetProgress),
    [clearProgress, resetProgress],
  )

  // Create progress states used to check empty, partial, and complete UI.
  const startAllExpeditions = useCallback(() => {
    developmentActions.startAllExpeditions(progressRef.current, commitProgress)
  }, [commitProgress, progressRef])

  const progressNextCheckpoint = useCallback(
    (moduleId: string) =>
      developmentActions.progressNextCheckpoint(
        moduleId,
        progressRef.current,
        completeCheckpoint,
      ),
    [completeCheckpoint, progressRef],
  )

  const progressAllNextCheckpoints = useCallback(
    () =>
      developmentActions.progressAllNextCheckpoints(
        progressRef.current,
        commitProgress,
      ),
    [commitProgress, progressRef],
  )

  const completeModule = useCallback(
    (moduleId: string) =>
      developmentActions.completeModule(
        moduleId,
        progressRef.current,
        commitProgress,
        notifyChange,
      ),
    [commitProgress, notifyChange, progressRef],
  )

  const randomizeModuleCheckpoints = useCallback(
    (moduleId: string) =>
      developmentActions.randomizeModuleCheckpoints(
        moduleId,
        progressRef.current,
        commitProgress,
        notifyChange,
      ),
    [commitProgress, notifyChange, progressRef],
  )

  const restartModule = useCallback(
    (moduleId: string) =>
      developmentActions.restartModule(
        moduleId,
        progressRef.current,
        commitProgress,
        notifyChange,
      ),
    [commitProgress, notifyChange, progressRef],
  )

  const completeAllModules = useCallback(
    () =>
      developmentActions.completeAllModules(
        progressRef.current,
        commitProgress,
      ),
    [commitProgress, progressRef],
  )

  const setModuleDiscovered = useCallback(
    (moduleId: string, discovered: boolean) =>
      developmentActions.setModuleDiscovered(
        moduleId,
        discovered,
        progressRef.current,
        commitProgress,
        notifyChange,
      ),
    [commitProgress, notifyChange, progressRef],
  )

  return useMemo<ExpeditionProgressDevToolsContextValue>(
    () => ({
      resetExpeditionProgress,
      startAllExpeditions,
      progressNextCheckpoint,
      progressAllNextCheckpoints,
      completeModule,
      randomizeModuleCheckpoints,
      restartModule,
      completeAllModules,
      setModuleDiscovered,
    }),
    [
      resetExpeditionProgress,
      startAllExpeditions,
      progressNextCheckpoint,
      progressAllNextCheckpoints,
      completeModule,
      randomizeModuleCheckpoints,
      restartModule,
      completeAllModules,
      setModuleDiscovered,
    ],
  )
}
