/**
  File: ExpeditionProgressProvider.tsx | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Own expedition progress state and persist it through the local save adapter.

  Usage:
  - Wrap application consumers that read or update expedition progress.

  Notes:
  - Journal presentation and notifications are handled by the journal feature.
 */
import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react'
import type { LearningModule } from '@/modules/types'
import {
  clearExpeditionProgressStorage,
  loadExpeditionProgress,
  saveExpeditionProgress,
} from './expeditionProgressStorage'
import * as progressActions from './expedition-progress'
import {
  ExpeditionProgressContext,
  type ExpeditionProgressContextValue,
} from './useExpeditionProgress'
import type { ExpeditionProgressChange, ExpeditionProgressData } from './types'

type ExpeditionProgressProviderProps = {
  children: ReactNode
}

// Initialize shared progress state and expose its actions to application consumers.
export function ExpeditionProgressProvider({
  children,
}: ExpeditionProgressProviderProps) {
  const [initialProgress] = useState(loadExpeditionProgress)
  const [progress, setProgress] = useState(initialProgress.progress)
  const [isStorageAvailable, setIsStorageAvailable] = useState(
    initialProgress.isAvailable,
  )
  const progressRef = useRef(progress)
  const listenersRef = useRef(
    new Set<(change: ExpeditionProgressChange) => void>(),
  )

  // Update the in-memory snapshot and persist the new progress.
  const commitProgress = useCallback((next: ExpeditionProgressData) => {
    progressRef.current = next
    setProgress(next)
    setIsStorageAvailable(saveExpeditionProgress(next))
  }, [])

  // Publish a progress event with the module's latest derived status.
  const notifyChange = useCallback(
    (
      module: LearningModule,
      kind: ExpeditionProgressChange['kind'],
      next: ExpeditionProgressData,
    ) => {
      const change = {
        moduleId: module.id,
        kind,
        progress: progressActions.getModuleProgress(module, next),
      }

      for (const listener of listenersRef.current) {
        listener(change)
      }
    },
    [],
  )

  // Register a subscriber for expedition progress changes.
  const subscribeToChanges = useCallback(
    (listener: (change: ExpeditionProgressChange) => void) => {
      listenersRef.current.add(listener)
      return () => listenersRef.current.delete(listener)
    },
    [],
  )

  // Start the specified expedition if it has not started yet.
  const startExpedition = useCallback(
    (moduleId: string) =>
      progressActions.startExpedition(
        moduleId,
        progressRef.current,
        commitProgress,
        notifyChange,
      ),
    [commitProgress, notifyChange],
  )

  // Record a checkpoint completion for a module.
  const completeCheckpoint = useCallback(
    (moduleId: string, checkpointId: string) => {
      progressActions.completeCheckpoint(
        moduleId,
        checkpointId,
        progressRef.current,
        commitProgress,
        notifyChange,
      )
    },
    [commitProgress, notifyChange],
  )

  // Complete the next unfinished checkpoint in one module.
  const progressNextCheckpoint = useCallback(
    (moduleId: string) =>
      progressActions.progressNextCheckpoint(
        moduleId,
        progressRef.current,
        completeCheckpoint,
      ),
    [completeCheckpoint],
  )

  // Check whether a checkpoint is present in the saved progress.
  const isCheckpointComplete = useCallback(
    (moduleId: string, checkpointId: string) =>
      progressActions.isCheckpointComplete(progress, moduleId, checkpointId),
    [progress],
  )

  // Get the saved checkpoint ids for one module.
  const getCompletedCheckpoints = useCallback(
    (moduleId: string) =>
      progressActions.getCompletedCheckpoints(progress, moduleId),
    [progress],
  )

  // Derive the completion summary for one module.
  const getExpeditionProgress = useCallback(
    (module: LearningModule) =>
      progressActions.getExpeditionProgress(module, progress),
    [progress],
  )

  // Clear saved progress and reset the provider's in-memory snapshot.
  const resetExpeditionProgress = useCallback(() => {
    progressActions.resetExpeditionProgress(
      clearExpeditionProgressStorage,
      (available) => {
        progressRef.current = {}
        setProgress({})
        setIsStorageAvailable(available)
      },
    )
  }, [])

  // Start all visible expeditions that have not yet been started.
  const startAllExpeditions = useCallback(() => {
    progressActions.startAllExpeditions(progressRef.current, commitProgress)
  }, [commitProgress])

  // Advance every visible expedition by one unfinished checkpoint.
  const progressAllNextCheckpoints = useCallback(() => {
    return progressActions.progressAllNextCheckpoints(
      progressRef.current,
      commitProgress,
    )
  }, [commitProgress])

  // Complete every checkpoint in one module.
  const completeModule = useCallback(
    (moduleId: string) =>
      progressActions.completeModule(
        moduleId,
        progressRef.current,
        commitProgress,
        notifyChange,
      ),
    [commitProgress, notifyChange],
  )

  // Assign randomized checkpoint completion to one module.
  const randomizeModuleCheckpoints = useCallback(
    (moduleId: string) =>
      progressActions.randomizeModuleCheckpoints(
        moduleId,
        progressRef.current,
        commitProgress,
        notifyChange,
      ),
    [commitProgress, notifyChange],
  )

  // Restart one module with no completed checkpoints.
  const restartModule = useCallback(
    (moduleId: string) =>
      progressActions.restartModule(
        moduleId,
        progressRef.current,
        commitProgress,
        notifyChange,
      ),
    [commitProgress, notifyChange],
  )

  // Complete every checkpoint in every visible module.
  const completeAllModules = useCallback(() => {
    progressActions.completeAllModules(progressRef.current, commitProgress)
  }, [commitProgress])

  // Memoize the state and action interface exposed to consumers.
  const contextValue = useMemo<ExpeditionProgressContextValue>(
    () => ({
      progress,
      isStorageAvailable,
      subscribeToChanges,
      startExpedition,
      completeCheckpoint,
      isCheckpointComplete,
      getCompletedCheckpoints,
      getExpeditionProgress,
      resetExpeditionProgress,
      startAllExpeditions,
      progressNextCheckpoint,
      progressAllNextCheckpoints,
      completeModule,
      randomizeModuleCheckpoints,
      restartModule,
      completeAllModules,
    }),
    [
      progress,
      isStorageAvailable,
      subscribeToChanges,
      startExpedition,
      completeCheckpoint,
      isCheckpointComplete,
      getCompletedCheckpoints,
      getExpeditionProgress,
      resetExpeditionProgress,
      startAllExpeditions,
      progressNextCheckpoint,
      progressAllNextCheckpoints,
      completeModule,
      randomizeModuleCheckpoints,
      restartModule,
      completeAllModules,
    ],
  )

  return (
    <ExpeditionProgressContext.Provider value={contextValue}>
      {children}
    </ExpeditionProgressContext.Provider>
  )
}
