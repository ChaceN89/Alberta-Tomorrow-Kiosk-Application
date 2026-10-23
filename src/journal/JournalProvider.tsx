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
  // null selects the journal's title page.
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null)
  // The ref keeps rapid checkpoint calls from reading stale state.
  const progressRef = useRef(progress)

  const commitProgress = useCallback((next: JournalProgress) => {
    progressRef.current = next
    setProgress(next)
    setIsStorageAvailable(saveJournal(next))
  }, [])

  const startExpedition = useCallback(
    (moduleId: string) => {
      if (
        !modules.some((entry) => entry.id === moduleId) ||
        progressRef.current[moduleId]
      ) {
        return
      }

      commitProgress({
        ...progressRef.current,
        [moduleId]: { startedAt: new Date().toISOString(), checkpoints: {} },
      })
      toast.success(t('toastStarted'), {
        id: JOURNAL_TOAST_ID,
        duration: 2500,
      })
    },
    [commitProgress, t],
  )

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
      const record = current[moduleId]

      if (record?.checkpoints[checkpointId]) {
        return
      }

      const now = new Date().toISOString()

      commitProgress({
        ...current,
        [moduleId]: {
          startedAt: record?.startedAt ?? now,
          checkpoints: { ...record?.checkpoints, [checkpointId]: now },
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
      Boolean(progress[moduleId]?.checkpoints[checkpointId]),
    [progress],
  )

  const getCompletedCheckpoints = useCallback(
    (moduleId: string) => Object.keys(progress[moduleId]?.checkpoints ?? {}),
    [progress],
  )

  const getExpeditionProgress = useCallback(
    (module: LearningModule): ExpeditionProgress => {
      const record = progress[module.id]
      const total = module.checkpoints.length
      const completed = record
        ? module.checkpoints.filter((id) => id in record.checkpoints).length
        : 0

      return {
        completed,
        total,
        status: !record
          ? 'notStarted'
          : total > 0 && completed === total
            ? 'complete'
            : 'inProgress',
      }
    },
    [progress],
  )

  const resetJournal = useCallback(() => {
    commitProgress({})
  }, [commitProgress])

  const selectExpedition = useCallback((moduleId: string | null) => {
    setActiveModuleId(
      moduleId !== null && modules.some((entry) => entry.id === moduleId)
        ? moduleId
        : null,
    )
  }, [])

  const openJournal = useCallback((moduleId?: string) => {
    if (moduleId !== undefined) {
      // Only started expeditions have journal pages; others show the title page.
      setActiveModuleId(progressRef.current[moduleId] ? moduleId : null)
    }

    setIsOpen(true)
  }, [])

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
      startExpedition,
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
      startExpedition,
    ],
  )

  return (
    <JournalContext.Provider value={contextValue}>
      {children}
    </JournalContext.Provider>
  )
}
