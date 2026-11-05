/**
  File: JournalProvider.tsx | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Nov 5, 2026

  Description:
  - Control journal navigation and present notifications for progress changes.

  Usage:
  - Wrap application routes inside ExpeditionProgressProvider.

  Notes:
  - Owns journal UI state; checkpoint progress and persistence stay in save-data.
 */
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { JournalToast } from '../journal-ui/JournalToast'
import { NOTIFICATION_TOASTER_ID } from '@/components/toasts/toasterIds'
import {
  useExpeditionProgress,
  type ExpeditionProgressChange,
} from '@/save-data/expedition-progress'
import { visibleModules } from '@/modules/registry'
import type { LearningModule } from '@/modules/types'
import { JournalContext } from './useJournal'

type JournalProviderProps = {
  children: ReactNode
}

export function JournalProvider({ children }: JournalProviderProps) {
  // Translation, system for the journal provider
  const { t, i18n } = useTranslation('journal')

  // Expedition progress system
  const { progress, subscribeToChanges } = useExpeditionProgress()

  // Journal open state
  const [isOpen, setIsOpen] = useState(false)

  // Active module ID
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null)

  // Journal toast sequence
  const journalToastSequence = useRef(0)

  // Open the journal and optionally set the active module- this can be called from any part of the application
  const openJournal = useCallback(
    (moduleId?: string) => {
      if (moduleId !== undefined) {
        setActiveModuleId(
          visibleModules.some((entry) => entry.id === moduleId) &&
            progress[moduleId]
            ? moduleId
            : null,
        )
      }

      setIsOpen(true)
    },
    [progress],
  )

  // Close the journal
  const closeJournal = useCallback(() => {
    setIsOpen(false)
  }, [])

  // Show a toast notification for journal progress changes - Journal Update or other relevant events
  const showJournalToast = useCallback(
    (module: LearningModule, change: ExpeditionProgressChange) => {
      const title = i18n.t('title', { ns: module.translationNamespace })
      const message =
        change.kind === 'started'
          ? t('toastStarted')
          : change.progress.status === 'complete'
            ? t('toastCompleted')
            : t('toastUpdated')
      const toastId = `journal-${journalToastSequence.current++}`

      // Display the toast notification using the JournalToast component
      toast(
        <JournalToast
          message={message}
          title={title}
          progress={change.progress}
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
    [i18n, openJournal, t],
  )

  // Subscribe to expedition progress changes and show journal toasts accordingly
  useEffect(
    () =>
      subscribeToChanges((change) => {
        const module = visibleModules.find(
          (entry) => entry.id === change.moduleId,
        )

        if (!module) {
          console.warn(
            `Unknown journal module "${change.moduleId}" received a progress change.`,
          )
          return
        }

        showJournalToast(module, change)
      }),
    [showJournalToast, subscribeToChanges],
  )

  // Select an expedition module to view in the journal
  const selectExpedition = useCallback((moduleId: string | null) => {
    setActiveModuleId(
      moduleId !== null && visibleModules.some((entry) => entry.id === moduleId)
        ? moduleId
        : null,
    )
  }, [])

  // Memoize the context value to avoid unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      isOpen,
      activeModuleId,
      openJournal,
      closeJournal,
      selectExpedition,
    }),
    [activeModuleId, closeJournal, isOpen, openJournal, selectExpedition],
  )

  // a wrapper around the children components providing the journal context
  return (
    <JournalContext.Provider value={contextValue}>
      {children}
    </JournalContext.Provider>
  )
}
