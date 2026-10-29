/**
  File: ApplicationStatePanel.tsx | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Preview startup and activity loading/error screens on demand.

  Usage:
  - Shared and app-state UI is imported by app or feature flows.

  Notes:
  - None.
 */
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { Loading } from '@/components/app-states/Loading'
import { SplashScreen } from '@/components/app-states/SplashScreen'
import { JournalToast } from '@/journal/components/JournalToast'
import {
  NOTIFICATION_TOASTER_ID,
  STATUS_TOASTER_ID,
} from '@/components/toasts/toasterIds'
import { useJournal } from '@/journal/useJournal'
import type { ExpeditionProgress } from '@/journal/useJournal'
import { DevPanel } from './DevPanel'

type ApplicationStatePanelProps = {
  onClose: () => void
}

type PreviewState =
  'startupLoading' | 'startupError' | 'activityLoading' | 'activityError' | null

const PREVIEW_TOAST_DURATION = 10_000 // preview toast duration in milliseconds
const SAMPLE_EXPEDITION_PROGRESS: ExpeditionProgress = {
  completed: 2,
  total: 5,
  status: 'inProgress',
}
const STATUS_BUTTON_CLASS =
  'button-secondary w-full border-sky-700 text-sky-900 hover:bg-sky-50 dark:border-sky-300 dark:text-sky-100 dark:hover:bg-sky-950'
const NOTIFICATION_BUTTON_CLASS =
  'button-secondary w-full border-violet-700 text-violet-900 hover:bg-violet-50 dark:border-violet-300 dark:text-violet-100 dark:hover:bg-violet-950'

function StatePreview({
  state,
  onClose,
}: {
  state: Exclude<PreviewState, null>
  onClose: () => void
}) {
  const { t: tGlobal } = useTranslation('global')
  const { t } = useTranslation('development')
  const isLoading = state === 'startupLoading' || state === 'activityLoading'

  return (
    <div className="fixed inset-0 z-120 grid place-items-center bg-ink/50 p-6">
      {state === 'startupLoading' ? (
        <SplashScreen isExiting={false} />
      ) : (
        <main className="grid min-h-[min(32rem,80dvh)] w-full max-w-2xl place-items-center rounded-2xl border border-line bg-canvas p-6">
          {isLoading ? (
            <Loading
              label={
                state === 'activityLoading'
                  ? tGlobal('preload.preparing')
                  : tGlobal('app.startupLoading')
              }
            />
          ) : (
            <section role="alert" className="panel w-full max-w-lg text-center">
              <h1 className="text-2xl">
                {state === 'startupError'
                  ? tGlobal('app.startupErrorTitle')
                  : tGlobal('preload.errorTitle')}
              </h1>
              <p className="my-4 text-muted">
                {state === 'startupError'
                  ? tGlobal('app.startupErrorDescription')
                  : tGlobal('preload.errorDescription')}
              </p>
              <button type="button" className="button" onClick={onClose}>
                {tGlobal('app.retry')}
              </button>
            </section>
          )}
        </main>
      )}
      <button
        type="button"
        className="fixed top-4 right-4 z-130 flex size-12 items-center justify-center rounded-full bg-surface text-2xl text-ink shadow-lg"
        aria-label={t('closePreview')}
        onClick={onClose}
      >
        <span aria-hidden="true">×</span>
      </button>
      <p className="sr-only" role="status">
        {t('previewMode')}
      </p>
    </div>
  )
}

export function ApplicationStatePanel({ onClose }: ApplicationStatePanelProps) {
  const { t } = useTranslation('development')
  const { t: tJournal } = useTranslation('journal')
  const { openJournal } = useJournal()
  const [previewState, setPreviewState] = useState<PreviewState>(null)

  return (
    <>
      <DevPanel title={t('applicationStates')} onClose={onClose}>
        <p className="mb-3 text-sm text-muted">
          {t('applicationStatesDescription')}
        </p>
        <div className="grid gap-2">
          <button
            type="button"
            className="button-secondary w-full"
            onClick={() => setPreviewState('startupLoading')}
          >
            {t('previewStartupLoading')}
          </button>
          <button
            type="button"
            className="button-secondary w-full"
            onClick={() => setPreviewState('startupError')}
          >
            {t('previewStartupError')}
          </button>
          <button
            type="button"
            className="button-secondary w-full"
            onClick={() => setPreviewState('activityLoading')}
          >
            {t('previewActivityLoading')}
          </button>
          <button
            type="button"
            className="button-secondary w-full"
            onClick={() => setPreviewState('activityError')}
          >
            {t('previewActivityError')}
          </button>
        </div>
        <div className="mt-4 space-y-3">
          <details className="rounded-xl border border-line p-3">
            <summary className="cursor-pointer font-semibold text-sky-900 dark:text-sky-100">
              {t('statusToastSection')}
            </summary>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <button
                type="button"
                className={STATUS_BUTTON_CLASS}
                onClick={() =>
                  toast.loading(t('statusToastLoadingMessage'), {
                    toasterId: STATUS_TOASTER_ID,
                    duration: PREVIEW_TOAST_DURATION,
                  })
                }
              >
                {t('previewStatusLoading')}
              </button>
              <button
                type="button"
                className={STATUS_BUTTON_CLASS}
                onClick={() =>
                  toast.success(t('statusToastSuccessMessage'), {
                    toasterId: STATUS_TOASTER_ID,
                    duration: PREVIEW_TOAST_DURATION,
                  })
                }
              >
                {t('previewStatusSuccess')}
              </button>
              <button
                type="button"
                className={STATUS_BUTTON_CLASS}
                onClick={() =>
                  toast.error(t('statusToastErrorMessage'), {
                    toasterId: STATUS_TOASTER_ID,
                    duration: PREVIEW_TOAST_DURATION,
                  })
                }
              >
                {t('previewStatusError')}
              </button>
            </div>
          </details>
          <details className="rounded-xl border border-line p-3">
            <summary className="cursor-pointer font-semibold text-violet-900 dark:text-violet-100">
              {t('notificationToastSection')}
            </summary>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <button
                type="button"
                className={NOTIFICATION_BUTTON_CLASS}
                onClick={() =>
                  toast(
                    <JournalToast
                      message={tJournal('toastUpdated')}
                      title={t('toastSampleExpedition')}
                      progress={SAMPLE_EXPEDITION_PROGRESS}
                      onViewJournal={() => openJournal()}
                    />,
                    {
                      toasterId: NOTIFICATION_TOASTER_ID,
                      duration: PREVIEW_TOAST_DURATION,
                    },
                  )
                }
              >
                {t('previewNotificationJournal')}
              </button>
              <button
                type="button"
                className={NOTIFICATION_BUTTON_CLASS}
                onClick={() =>
                  toast.success(t('notificationToastSuccessMessage'), {
                    toasterId: NOTIFICATION_TOASTER_ID,
                    duration: PREVIEW_TOAST_DURATION,
                  })
                }
              >
                {t('previewNotificationSuccess')}
              </button>
              <button
                type="button"
                className={NOTIFICATION_BUTTON_CLASS}
                onClick={() =>
                  toast.error(t('notificationToastErrorMessage'), {
                    toasterId: NOTIFICATION_TOASTER_ID,
                    duration: PREVIEW_TOAST_DURATION,
                  })
                }
              >
                {t('previewNotificationError')}
              </button>
            </div>
          </details>
        </div>
      </DevPanel>
      {previewState && (
        <StatePreview
          state={previewState}
          onClose={() => setPreviewState(null)}
        />
      )}
    </>
  )
}
