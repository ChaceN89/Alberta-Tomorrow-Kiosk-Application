/**
  File: ToastPreviewGroups.tsx | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Preview status and notification toasts using their normal default durations.

  Usage:
  - Rendered by ApplicationStatePanel.

  Notes:
  - None.
 */
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import {
  NOTIFICATION_TOASTER_ID,
  STATUS_TOASTER_ID,
} from '@/components/toasts/toasterIds'
import { JournalToast } from '@/journal/components/JournalToast'
import type { ExpeditionProgress } from '@/journal/useJournal'

type ToastPreviewGroupsProps = {
  openJournal: () => void
}

const SAMPLE_EXPEDITION_PROGRESS: ExpeditionProgress = {
  completed: 2,
  total: 5,
  status: 'inProgress',
}

const neutralButtonClass = 'button-secondary min-w-0 px-2 py-2 text-xs'
const positiveButtonClass = 'button min-w-0 px-2 py-2 text-xs'
const destructiveButtonClass = 'button-danger min-w-0 px-2 py-2 text-xs'

export function ToastPreviewGroups({ openJournal }: ToastPreviewGroupsProps) {
  const { t } = useTranslation('development')
  const { t: tJournal } = useTranslation('journal')

  return (
    <div className="mt-4 space-y-3">
      <details className="rounded-xl border border-line p-3">
        <summary className="cursor-pointer font-semibold">
          {t('statusToastSection')}
        </summary>
        <div className="mt-3 grid grid-cols-3 gap-2">
          <button
            type="button"
            className={neutralButtonClass}
            onClick={() =>
              toast.loading(t('statusToastLoadingMessage'), {
                toasterId: STATUS_TOASTER_ID,
              })
            }
          >
            {t('previewStatusLoading')}
          </button>
          <button
            type="button"
            className={positiveButtonClass}
            onClick={() =>
              toast.success(t('statusToastSuccessMessage'), {
                toasterId: STATUS_TOASTER_ID,
              })
            }
          >
            {t('previewStatusSuccess')}
          </button>
          <button
            type="button"
            className={destructiveButtonClass}
            onClick={() =>
              toast.error(t('statusToastErrorMessage'), {
                toasterId: STATUS_TOASTER_ID,
              })
            }
          >
            {t('previewStatusError')}
          </button>
        </div>
      </details>
      <details className="rounded-xl border border-line p-3">
        <summary className="cursor-pointer font-semibold">
          {t('notificationToastSection')}
        </summary>
        <div className="mt-3 grid grid-cols-3 gap-2">
          <button
            type="button"
            className={neutralButtonClass}
            onClick={() =>
              toast(
                <JournalToast
                  message={tJournal('toastUpdated')}
                  title={t('toastSampleExpedition')}
                  progress={SAMPLE_EXPEDITION_PROGRESS}
                  onViewJournal={openJournal}
                />,
                { toasterId: NOTIFICATION_TOASTER_ID },
              )
            }
          >
            {t('previewNotificationJournal')}
          </button>
          <button
            type="button"
            className={positiveButtonClass}
            onClick={() =>
              toast.success(t('notificationToastSuccessMessage'), {
                toasterId: NOTIFICATION_TOASTER_ID,
              })
            }
          >
            {t('previewNotificationSuccess')}
          </button>
          <button
            type="button"
            className={destructiveButtonClass}
            onClick={() =>
              toast.error(t('notificationToastErrorMessage'), {
                toasterId: NOTIFICATION_TOASTER_ID,
              })
            }
          >
            {t('previewNotificationError')}
          </button>
        </div>
      </details>
    </div>
  )
}
