/**
 * File: JournalProvider.tsx | Author: Chace Nielson
 * Created: 2026-10-23 | Updated: 2026-10-23
 * Description: Track expedition checkpoints, persist them locally, and control the journal modal.
 * Dependencies: React, react-hot-toast, react-i18next, module registry, journalStorage.
 */
import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { modules } from '../modules/registry'
import type { LearningModule } from '../modules/types'
import {
  loadJournal,
  saveJournal,
  type JournalProgress,
} from './journalStorage'
import { JournalContext, type ExpeditionProgress } from './useJournal'

const JOURNAL_TOAST_ID = 'journal-update'

type JournalProviderProps = {
  children: ReactNode
}

export function JournalProvider({ children }: JournalProviderProps) {
  const { t } = useTranslation('journal')
  const [initialJournal] = useState(loadJournal)
  const [progress, setProgress] = useState<JournalProgress>(
    initialJournal.progress,
  )
  const [isStorageAvailable, setIsStorageAvailable] = useState(
    initialJournal.isAvailable,
  )
  const [isOpen, setIsOpen] = useState(false)
  const [activeModuleId, setActiveModuleId] = useState<string | null>(
    modules[0]?.id ?? null,
  )
  // The ref keeps rapid checkpoint calls from reading stale state.
  const progressRef = useRef(progress)

  const commitProgress = useCallback((next: JournalProgress) => {
    progressRef.current = next
    setProgress(next)
    setIsStorageAvailable(saveJournal(next))
  }, [])

  const completeCheckpoint = useCallback(
    (moduleId: string, checkpointId: string) => {
      const module = modules.find((entry) => entry.id === moduleId)

      if (!module?.checkpoints.includes(checkpointId)) {
        console.warn(
          `Unknown journal checkpoint "${checkpointId}" for module "${moduleId}".`,
        )
        return
      }

      const current = progressRef.current

      if (current[moduleId]?.[checkpointId]) {
        return
      }

      commitProgress({
        ...current,
        [moduleId]: {
          ...current[moduleId],
          [checkpointId]: new Date().toISOString(),
        },
      })
      toast.success(t('toastUpdated'), {
        id: JOURNAL_TOAST_ID,
        duration: 2500,
      })
    },
    [commitProgress, t],
  )

  const isCheckpointComplete = useCallback(
    (moduleId: string, checkpointId: string) =>
      Boolean(progress[moduleId]?.[checkpointId]),
    [progress],
  )

  const getCompletedCheckpoints = useCallback(
    (moduleId: string) => Object.keys(progress[moduleId] ?? {}),
    [progress],
  )

  const getExpeditionProgress = useCallback(
    (module: LearningModule): ExpeditionProgress => {
      const recorded = progress[module.id] ?? {}
      const total = module.checkpoints.length
      const completed = module.checkpoints.filter((id) => id in recorded).length

      return {
        completed,
        total,
        status:
          completed === 0
            ? 'notStarted'
            : completed === total
              ? 'complete'
              : 'inProgress',
      }
    },
    [progress],
  )

  const resetJournal = useCallback(() => {
    commitProgress({})
  }, [commitProgress])

  const selectExpedition = useCallback((moduleId: string) => {
    if (modules.some((entry) => entry.id === moduleId)) {
      setActiveModuleId(moduleId)
    }
  }, [])

  const openJournal = useCallback(
    (moduleId?: string) => {
      if (moduleId) {
        selectExpedition(moduleId)
      }

      setIsOpen(true)
    },
    [selectExpedition],
  )

  const closeJournal = useCallback(() => {
    setIsOpen(false)
  }, [])

  const contextValue = useMemo(
    () => ({
      isOpen,
      activeModuleId,
      isStorageAvailable,
      openJournal,
      closeJournal,
      selectExpedition,
      completeCheckpoint,
      isCheckpointComplete,
      getCompletedCheckpoints,
      getExpeditionProgress,
      resetJournal,
    }),
    [
      activeModuleId,
      closeJournal,
      completeCheckpoint,
      getCompletedCheckpoints,
      getExpeditionProgress,
      isCheckpointComplete,
      isOpen,
      isStorageAvailable,
      openJournal,
      resetJournal,
      selectExpedition,
    ],
  )

  return (
    <JournalContext.Provider value={contextValue}>
      {children}
    </JournalContext.Provider>
  )
}
