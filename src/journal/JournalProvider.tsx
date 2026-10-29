/**
  File: JournalProvider.tsx | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Track expedition checkpoints, persist them locally, and control the journal modal.

  Usage:
  - Providers supply or wrap state.

  Notes:
  - None.
 */
import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { JournalToast } from '../components/toasts/JournalToast'
import { NOTIFICATION_TOASTER_ID } from '../components/toasts/toasterIds'
import { visibleModules } from '../modules/registry'
import type { LearningModule } from '../modules/types'
import {
  loadJournal,
  saveJournal,
  type JournalProgress,
} from './journalStorage'
import { JournalContext, type ExpeditionProgress } from './useJournal'

const JOURNAL_TOAST_ID = 'journal-update'

function getModuleProgress(
  module: LearningModule,
  journalProgress: JournalProgress,
): ExpeditionProgress {
  const record = journalProgress[module.id]
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
}

type JournalProviderProps = {
  children: ReactNode
}

export function JournalProvider({ children }: JournalProviderProps) {
  const { t, i18n } = useTranslation('journal')
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

  const openJournal = useCallback((moduleId?: string) => {
    if (moduleId !== undefined) {
      // Only started expeditions have journal pages; others show the title page.
      setActiveModuleId(
        visibleModules.some((entry) => entry.id === moduleId) &&
          progressRef.current[moduleId]
          ? moduleId
          : null,
      )
    }

    setIsOpen(true)
  }, [])

  const showJournalToast = useCallback(
    (module: LearningModule, message: string) => {
      const title = i18n.t('title', { ns: module.translationNamespace })
      const progress = getModuleProgress(module, progressRef.current)

      toast(
        <JournalToast
          message={message}
          title={title}
          progress={progress}
          onViewJournal={() => {
            openJournal(module.id)
            toast.dismiss(JOURNAL_TOAST_ID, NOTIFICATION_TOASTER_ID)
          }}
        />,
        {
          id: JOURNAL_TOAST_ID,
          toasterId: NOTIFICATION_TOASTER_ID,
        },
      )
    },
    [i18n, openJournal],
  )

  const startExpedition = useCallback(
    (moduleId: string) => {
      const module = visibleModules.find((entry) => entry.id === moduleId)

      if (!module || progressRef.current[moduleId]) {
        return
      }

      commitProgress({
        ...progressRef.current,
        [moduleId]: { startedAt: new Date().toISOString(), checkpoints: {} },
      })
      showJournalToast(module, t('toastStarted'))
    },
    [commitProgress, showJournalToast, t],
  )

  const completeCheckpoint = useCallback(
    (moduleId: string, checkpointId: string) => {
      const module = visibleModules.find((entry) => entry.id === moduleId)

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
      showJournalToast(module, t('toastUpdated'))
    },
    [commitProgress, showJournalToast, t],
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
    (module: LearningModule) => getModuleProgress(module, progress),
    [progress],
  )

  const resetJournal = useCallback(() => {
    commitProgress({})
  }, [commitProgress])

  const selectExpedition = useCallback((moduleId: string | null) => {
    setActiveModuleId(
      moduleId !== null && visibleModules.some((entry) => entry.id === moduleId)
        ? moduleId
        : null,
    )
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
