/**
  File: TutorialsPanel.tsx | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Developer controls to reset or restart the first-visit tutorial.

  Usage:
  - Shared and app-state UI is imported by app or feature flows.

  Notes:
  - None.
 */
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { NOTIFICATION_TOASTER_ID } from '../../toasts/toasterIds'
import { useIntroTutorial } from '../../../tutorials/intro-tutorial/useIntroTutorial'
import { resetMediaPlayerTutorial } from '../../../tutorials/media-player-tutorial/mediaPlayerTutorialStorage'
import { DevPanel } from './DevPanel'

type TutorialsPanelProps = {
  onClose: () => void
  onRestarted: () => void
}

export function TutorialsPanel({ onClose, onRestarted }: TutorialsPanelProps) {
  const { t } = useTranslation('development')
  const { resetFlag, restartTutorial } = useIntroTutorial()

  return (
    <DevPanel title={t('tutorials')} onClose={onClose}>
      <p className="mb-3 text-sm text-muted">{t('tutorialsDescription')}</p>
      <div className="grid gap-2">
        <button
          type="button"
          className="button-secondary w-full"
          onClick={() => {
            resetFlag()
            toast(t('introTutorialFlagReset'), {
              toasterId: NOTIFICATION_TOASTER_ID,
            })
          }}
        >
          {t('resetIntroTutorialFlag')}
        </button>
        <button
          type="button"
          className="button w-full"
          onClick={() => {
            restartTutorial()
            onRestarted()
          }}
        >
          {t('restartIntroTutorial')}
        </button>
        <button
          type="button"
          className="button-secondary w-full"
          onClick={() => {
            resetMediaPlayerTutorial()
            toast(t('mediaPlayerTutorialFlagReset'), {
              toasterId: NOTIFICATION_TOASTER_ID,
            })
          }}
        >
          {t('resetMediaPlayerTutorialFlag')}
        </button>
      </div>
    </DevPanel>
  )
}
