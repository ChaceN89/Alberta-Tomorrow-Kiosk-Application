/**
  File: ExpeditionProgressProvider.tsx | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Nov 5, 2026

  Description:
  - Own expedition progress state and persist it through the selected repository.

  Usage:
  - Wrap application consumers and provide a loading fallback while data loads.

  Notes:
  - Journal presentation and notifications are handled by the journal feature.
 */
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { LearningModule } from '@/modules/types'
import { localStorageExpeditionProgressRepository } from '../repository/localStorageExpeditionProgressRepository'
import type { ExpeditionProgressRepository } from '../repository/ExpeditionProgressRepository'
import * as progressActions from '../actions'
import {
  ExpeditionProgressContext,
  type ExpeditionProgressContextValue,
} from './useExpeditionProgress'
import { ExpeditionProgressDevToolsContext } from '../development/useExpeditionProgressDevTools'
import { useExpeditionProgressDevToolsActions } from '../development/useExpeditionProgressDevToolsActions'
import type { ExpeditionProgressChange, ExpeditionProgressData } from '../types'

type ExpeditionProgressProviderProps = {
  children: ReactNode
  fallback?: ReactNode
  // Keep the repository stable for this provider's lifetime.
  repository?: ExpeditionProgressRepository
}

// Initialize progress from the selected repository and expose feature actions.
export function ExpeditionProgressProvider({
  children,
  fallback = null,
  repository = localStorageExpeditionProgressRepository,
}: ExpeditionProgressProviderProps) {
  const [progress, setProgress] = useState<ExpeditionProgressData>({})
  const [isStorageAvailable, setIsStorageAvailable] = useState(true)
  const [loadedRepository, setLoadedRepository] =
    useState<ExpeditionProgressRepository | null>(null)
  const isReady = loadedRepository === repository
  const progressRef = useRef<ExpeditionProgressData>({})
  const writeSequenceRef = useRef(0)
  const writeQueueRef = useRef(Promise.resolve())
  const listenersRef = useRef(
    new Set<(change: ExpeditionProgressChange) => void>(),
  )

  // Hydrate the provider before exposing pages that read or update progress.
  useEffect(() => {
    let isCurrent = true
    writeSequenceRef.current += 1

    void repository
      .load()
      .then((result) => {
        if (!isCurrent) return

        progressRef.current = result.progress
        setProgress(result.progress)
        setIsStorageAvailable(result.isAvailable)
        setLoadedRepository(repository)
      })
      .catch((error: unknown) => {
        console.error('Failed to load expedition progress.', error)
        if (!isCurrent) return

        setIsStorageAvailable(false)
        setLoadedRepository(repository)
      })

    return () => {
      isCurrent = false
    }
  }, [repository])

  // Update the in-memory snapshot and persist the new progress.
  const commitProgress = useCallback(
    (next: ExpeditionProgressData) => {
      progressRef.current = next
      setProgress(next)
      const writeSequence = ++writeSequenceRef.current
      const write = writeQueueRef.current.then(() => repository.save(next))
      writeQueueRef.current = write.then(
        () => undefined,
        () => undefined,
      )

      void write
        .then((isAvailable) => {
          if (writeSequence === writeSequenceRef.current) {
            setIsStorageAvailable(isAvailable)
          }
        })
        .catch((error: unknown) => {
          console.error('Failed to save expedition progress.', error)
          if (writeSequence === writeSequenceRef.current) {
            setIsStorageAvailable(false)
          }
        })
    },
    [repository],
  )

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
    ],
  )

  const clearProgress = useCallback(async () => {
    try {
      await writeQueueRef.current
      return await repository.clear()
    } catch (error) {
      console.error('Failed to clear expedition progress.', error)
      return false
    }
  }, [repository])

  const resetProgress = useCallback((available: boolean) => {
    writeSequenceRef.current += 1
    progressRef.current = {}
    setProgress({})
    setIsStorageAvailable(available)
  }, [])

  const devToolsContextValue = useExpeditionProgressDevToolsActions({
    progressRef,
    commitProgress,
    completeCheckpoint,
    notifyChange,
    clearProgress,
    resetProgress,
  })

  return isReady ? (
    <ExpeditionProgressContext.Provider value={contextValue}>
      <ExpeditionProgressDevToolsContext.Provider value={devToolsContextValue}>
        {children}
      </ExpeditionProgressDevToolsContext.Provider>
    </ExpeditionProgressContext.Provider>
  ) : (
    fallback
  )
}
