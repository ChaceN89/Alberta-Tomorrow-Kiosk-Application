/**
 * File: IntroTourPanel.tsx | Author: Chace Nielson
 * Created: 2026-10-23 | Updated: 2026-10-23
 * Description: Developer controls to reset or restart the first-visit intro tour.
 * Dependencies: react-hot-toast, react-i18next, intro tour context.
 */
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useIntroTour } from '../../../introTour/useIntroTour'
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
            toast(t('introTourFlagReset'), { id: 'intro-tour-reset' })
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
      </div>
    </DevPanel>
  )
}
