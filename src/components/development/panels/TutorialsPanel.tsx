/**
  File: TutorialsPanel.tsx | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Developer controls to reset or restart the first-visit tutorial.

  Usage:
  - Shared and app-state UI is imported by app or feature flows.

  Notes:
  - None.
 */
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { NOTIFICATION_TOASTER_ID } from '@/components/toasts/toasterIds'
import { useIntroTutorial } from '@/tutorials/intro-tutorial/useIntroTutorial'
import { requestMediaPlayerTutorialStart } from '@/tutorials/media-player-tutorial/mediaPlayerTutorialEvents'
import { resetMediaPlayerTutorial } from '@/tutorials/media-player-tutorial/mediaPlayerTutorialStorage'
import { DevPanel } from './DevPanel'

type TutorialsPanelProps = {
  onClose: () => void
  onTutorialStarted: () => void
  onResetAllTutorialFlags: () => void
  onCompleteAllTutorials: () => void
}

export function TutorialsPanel({
  onClose,
  onTutorialStarted,
  onResetAllTutorialFlags,
  onCompleteAllTutorials,
}: TutorialsPanelProps) {
  const { t } = useTranslation('development')
  const { resetFlag, restartTutorial } = useIntroTutorial()

  const startMediaPlayerTutorial = () => {
    resetMediaPlayerTutorial()
    requestMediaPlayerTutorialStart()
    onTutorialStarted()
    toast(t('mediaPlayerTutorialStarted'), {
      toasterId: NOTIFICATION_TOASTER_ID,
    })
  }

  return (
    <DevPanel title={t('tutorials')} onBack={onClose}>
      <p className="mb-3 text-sm text-muted">{t('tutorialsDescription')}</p>
      <div className="space-y-4">
        <section
          aria-labelledby="dev-all-tutorials-heading"
          className="space-y-2"
        >
          <h3
            id="dev-all-tutorials-heading"
            className="font-semibold text-muted"
          >
            {t('allTutorialsGroup')}
          </h3>
          <div className="grid gap-2">
            <button
              type="button"
              className="button-danger w-full"
              onClick={onResetAllTutorialFlags}
            >
              {t('resetAllTutorialFlags')}
            </button>
            <button
              type="button"
              className="button w-full"
              onClick={onCompleteAllTutorials}
            >
              {t('completeAllTutorials')}
            </button>
          </div>
        </section>
        <section
          aria-labelledby="dev-intro-tutorial-heading"
          className="space-y-2"
        >
          <h3
            id="dev-intro-tutorial-heading"
            className="font-semibold text-muted"
          >
            {t('introTutorialGroup')}
          </h3>
          <div className="grid gap-2">
            <button
              type="button"
              className="button-secondary w-full"
              onClick={() => {
                restartTutorial()
                onTutorialStarted()
              }}
            >
              {t('startTutorial')}
            </button>
            <button
              type="button"
              className="button-danger w-full"
              onClick={() => {
                resetFlag()
                toast(t('introTutorialFlagReset'), {
                  toasterId: NOTIFICATION_TOASTER_ID,
                })
              }}
            >
              {t('resetTutorialFlag')}
            </button>
          </div>
        </section>
        <section
          aria-labelledby="dev-media-tutorial-heading"
          className="space-y-2"
        >
          <h3
            id="dev-media-tutorial-heading"
            className="font-semibold text-muted"
          >
            {t('mediaPlayerTutorialGroup')}
          </h3>
          <div className="grid gap-2">
            <button
              type="button"
              className="button-secondary w-full"
              onClick={startMediaPlayerTutorial}
            >
              {t('startTutorial')}
            </button>
            <button
              type="button"
              className="button-danger w-full"
              onClick={() => {
                resetMediaPlayerTutorial()
                toast(t('mediaPlayerTutorialFlagReset'), {
                  toasterId: NOTIFICATION_TOASTER_ID,
                })
              }}
            >
              {t('resetTutorialFlag')}
            </button>
          </div>
        </section>
      </div>
    </DevPanel>
  )
}
