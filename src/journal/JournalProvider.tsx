/**
  File: JournalProvider.tsx | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 29, 2026

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
import { JournalToast } from './components/JournalToast'
import { NOTIFICATION_TOASTER_ID } from '@/components/toasts/toasterIds'
import { visibleModules } from '@/modules/registry'
import type { LearningModule } from '@/modules/types'
import {
  loadJournal,
  saveJournal,
  type JournalProgress,
} from './journalStorage'
import { JournalContext, type ExpeditionProgress } from './useJournal'

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
  const journalToastSequence = useRef(0)

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
      const toastId = `journal-${journalToastSequence.current++}`

      toast(
        <JournalToast
          message={message}
          title={title}
          progress={progress}
          onViewJournal={() => {
            openJournal(module.id)
            toast.dismiss(toastId, NOTIFICATION_TOASTER_ID)
          }}
        />,
        {
          id: toastId,
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

  const progressNextCheckpoint = useCallback(
    (moduleId: string) => {
      const module = visibleModules.find((entry) => entry.id === moduleId)

      if (!module) {
        console.warn(`Unknown journal module "${moduleId}".`)
        return false
      }

      const currentCheckpoints = progressRef.current[moduleId]?.checkpoints
      const checkpointId = module.checkpoints.find(
        (id) => currentCheckpoints?.[id] === undefined,
      )

      if (!checkpointId) return false

      completeCheckpoint(moduleId, checkpointId)
      return true
    },
    [completeCheckpoint],
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

  const startAllExpeditions = useCallback(() => {
    const current = progressRef.current
    const next: JournalProgress = { ...current }
    const timestamp = new Date().toISOString()
    let hasChanges = false

    for (const module of visibleModules) {
      if (current[module.id]) continue

      next[module.id] = { startedAt: timestamp, checkpoints: {} }
      hasChanges = true
    }

    if (hasChanges) commitProgress(next)
  }, [commitProgress])

  const progressAllNextCheckpoints = useCallback(() => {
    const current = progressRef.current
    const next: JournalProgress = { ...current }
    const timestamp = new Date().toISOString()
    let progressed = 0

    for (const module of visibleModules) {
      const record = current[module.id]
      const checkpointId = module.checkpoints.find(
        (id) => record?.checkpoints[id] === undefined,
      )

      if (!checkpointId) continue

      next[module.id] = {
        startedAt: record?.startedAt ?? timestamp,
        checkpoints: { ...record?.checkpoints, [checkpointId]: timestamp },
      }
      progressed += 1
    }

    if (progressed > 0) commitProgress(next)
    return progressed
  }, [commitProgress])

  const completeModule = useCallback(
    (moduleId: string) => {
      const module = visibleModules.find((entry) => entry.id === moduleId)

      if (!module) {
        console.warn(`Unknown journal module "${moduleId}".`)
        return false
      }

      if (module.checkpoints.length === 0) return false

      const current = progressRef.current
      const record = current[moduleId]
      const timestamp = new Date().toISOString()
      const checkpoints = { ...record?.checkpoints }
      let hasChanges = !record

      for (const checkpointId of module.checkpoints) {
        if (checkpoints[checkpointId] !== undefined) continue

        checkpoints[checkpointId] = timestamp
        hasChanges = true
      }

      if (!hasChanges) return false

      commitProgress({
        ...current,
        [moduleId]: {
          startedAt: record?.startedAt ?? timestamp,
          checkpoints,
        },
      })
      showJournalToast(module, t('toastUpdated'))
      return true
    },
    [commitProgress, showJournalToast, t],
  )

  const randomizeModuleCheckpoints = useCallback(
    (moduleId: string) => {
      const module = visibleModules.find((entry) => entry.id === moduleId)

      if (!module) {
        console.warn(`Unknown journal module "${moduleId}".`)
        return false
      }

      if (module.checkpoints.length === 0) return false

      const current = progressRef.current
      const record = current[moduleId]
      const timestamp = new Date().toISOString()
      const checkpoints: Record<string, string> = {}

      for (const checkpointId of module.checkpoints) {
        if (Math.random() < 0.5) checkpoints[checkpointId] = timestamp
      }

      const isUnchanged = module.checkpoints.every(
        (checkpointId) =>
          Boolean(checkpoints[checkpointId]) ===
          Boolean(record?.checkpoints[checkpointId]),
      )

      if (isUnchanged) {
        const index = Math.floor(Math.random() * module.checkpoints.length)
        const checkpointId = module.checkpoints[index]

        if (checkpoints[checkpointId] !== undefined) {
          delete checkpoints[checkpointId]
        } else {
          checkpoints[checkpointId] = timestamp
        }
      }

      commitProgress({
        ...current,
        [moduleId]: {
          startedAt: record?.startedAt ?? timestamp,
          checkpoints,
        },
      })
      showJournalToast(module, t('toastUpdated'))
      return true
    },
    [commitProgress, showJournalToast, t],
  )

  const restartModule = useCallback(
    (moduleId: string) => {
      const module = visibleModules.find((entry) => entry.id === moduleId)

      if (!module) {
        console.warn(`Unknown journal module "${moduleId}".`)
        return false
      }

      if (module.checkpoints.length === 0) return false

      const timestamp = new Date().toISOString()
      commitProgress({
        ...progressRef.current,
        [moduleId]: { startedAt: timestamp, checkpoints: {} },
      })
      showJournalToast(module, t('toastUpdated'))
      return true
    },
    [commitProgress, showJournalToast, t],
  )

  const completeAllModules = useCallback(() => {
    const current = progressRef.current
    const next: JournalProgress = { ...current }
    const timestamp = new Date().toISOString()
    let hasChanges = false

    for (const module of visibleModules) {
      if (module.checkpoints.length === 0) continue

      const record = current[module.id]
      const checkpoints = { ...record?.checkpoints }
      let moduleHasChanges = !record

      for (const checkpointId of module.checkpoints) {
        if (checkpoints[checkpointId] === undefined) {
          checkpoints[checkpointId] = timestamp
          moduleHasChanges = true
        }
      }

      if (!moduleHasChanges) continue

      next[module.id] = {
        startedAt: record?.startedAt ?? timestamp,
        checkpoints,
      }
      hasChanges = true
    }

    if (hasChanges) commitProgress(next)
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
      startAllExpeditions,
      progressNextCheckpoint,
      progressAllNextCheckpoints,
      completeModule,
      randomizeModuleCheckpoints,
      restartModule,
      completeAllModules,
    }),
    [
      activeModuleId,
      closeJournal,
      completeAllModules,
      completeModule,
      completeCheckpoint,
      getCompletedCheckpoints,
      getExpeditionProgress,
      isCheckpointComplete,
      isOpen,
      isStorageAvailable,
      openJournal,
      progressAllNextCheckpoints,
      progressNextCheckpoint,
      randomizeModuleCheckpoints,
      restartModule,
      resetJournal,
      startAllExpeditions,
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
