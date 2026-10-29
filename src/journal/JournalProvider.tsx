/**
  File: JournalProvider.tsx | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Control journal navigation and present notifications for progress changes.

  Usage:
  - Wrap application routes inside ExpeditionProgressProvider.

  Notes:
  - Saved expedition progress is owned by the save-data feature.
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
import { JournalToast } from './components/JournalToast'
import { NOTIFICATION_TOASTER_ID } from '@/components/toasts/toasterIds'
import { useExpeditionProgress } from '@/save-data/useExpeditionProgress'
import type { ExpeditionProgressChange } from '@/save-data/types'
import { visibleModules } from '@/modules/registry'
import type { LearningModule } from '@/modules/types'
import { JournalContext } from './useJournal'

type JournalProviderProps = {
  children: ReactNode
}

export function JournalProvider({ children }: JournalProviderProps) {
  const { t, i18n } = useTranslation('journal')
  const { progress, subscribeToChanges } = useExpeditionProgress()
  const [isOpen, setIsOpen] = useState(false)
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null)
  const journalToastSequence = useRef(0)

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

  const showJournalToast = useCallback(
    (module: LearningModule, change: ExpeditionProgressChange) => {
      const title = i18n.t('title', { ns: module.translationNamespace })
      const message =
        change.kind === 'started' ? t('toastStarted') : t('toastUpdated')
      const toastId = `journal-${journalToastSequence.current++}`

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
      openJournal,
      closeJournal,
      selectExpedition,
    }),
    [activeModuleId, closeJournal, isOpen, openJournal, selectExpedition],
  )

  return (
    <JournalContext.Provider value={contextValue}>
      {children}
    </JournalContext.Provider>
  )
}
