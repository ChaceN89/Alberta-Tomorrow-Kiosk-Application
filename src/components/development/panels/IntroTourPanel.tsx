/**
  File: IntroTourPanel.tsx | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Developer controls to reset or restart the first-visit intro tour.

  Usage:
  - Shared and app-state UI is imported by app or feature flows.

  Notes:
  - None.
 */
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { NOTIFICATION_TOASTER_ID } from '../../toasts/toasterIds'
import { useIntroTour } from '../../../site-tours/intro-tour/useIntroTour'
import { resetMediaPlayerTour } from '../../../site-tours/media-player-tour/mediaPlayerTourStorage'
import { DevPanel } from './DevPanel'

type IntroTourPanelProps = {
  onClose: () => void
  onRestarted: () => void
}

export function IntroTourPanel({ onClose, onRestarted }: IntroTourPanelProps) {
  const { t } = useTranslation('development')
  const { resetFlag, restartTour } = useIntroTour()

  return (
    <DevPanel title={t('introTour')} onClose={onClose}>
      <p className="mb-3 text-sm text-muted">{t('introTourDescription')}</p>
      <div className="grid gap-2">
        <button
          type="button"
          className="button-secondary w-full"
          onClick={() => {
            resetFlag()
            toast(t('introTourFlagReset'), {
              toasterId: NOTIFICATION_TOASTER_ID,
            })
          }}
        >
          {t('resetIntroTourFlag')}
        </button>
        <button
          type="button"
          className="button w-full"
          onClick={() => {
            restartTour()
            onRestarted()
          }}
        >
          {t('restartIntroTour')}
        </button>
        <button
          type="button"
          className="button-secondary w-full"
          onClick={() => {
            resetMediaPlayerTour()
            toast(t('mediaPlayerTourFlagReset'), {
              toasterId: NOTIFICATION_TOASTER_ID,
            })
          }}
        >
          {t('resetMediaPlayerTourFlag')}
        </button>
      </div>
    </DevPanel>
  )
}
