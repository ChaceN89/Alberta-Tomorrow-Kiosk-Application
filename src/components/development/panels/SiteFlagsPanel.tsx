/**
  File: SiteFlagsPanel.tsx | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Group developer actions that change saved site and module state.

  Usage:
  - DisplayTesting opens this panel from the developer tools menu.

  Notes:
  - None.
 */
import { useTranslation } from 'react-i18next'
import { DevPanel } from './DevPanel'

type SiteFlagsPanelProps = {
  onClose: () => void
  onResetSite: () => void
  onResetJournal: () => void
  onResetTutorialFlags: () => void
  onStartAllExpeditions: () => void
  onCompleteAllModules: () => void
}

export function SiteFlagsPanel({
  onClose,
  onResetSite,
  onResetJournal,
  onResetTutorialFlags,
  onStartAllExpeditions,
  onCompleteAllModules,
}: SiteFlagsPanelProps) {
  const { t } = useTranslation('development')

  return (
    <DevPanel title={t('siteFlags')} onClose={onClose}>
      <div className="grid gap-2">
        <button
          type="button"
          className="button-secondary w-full"
          onClick={onResetSite}
        >
          {t('resetSite')}
        </button>
        <button
          type="button"
          className="button-secondary w-full"
          onClick={onResetTutorialFlags}
        >
          {t('resetTutorialFlags')}
        </button>
        <button
          type="button"
          className="button-secondary w-full"
          onClick={onResetJournal}
        >
          {t('resetJournal')}
        </button>
        <button
          type="button"
          className="button-secondary w-full"
          onClick={onStartAllExpeditions}
        >
          {t('startAllExpeditions')}
        </button>
        <button
          type="button"
          className="button w-full"
          onClick={onCompleteAllModules}
        >
          {t('setAllModulesComplete')}
        </button>
      </div>
    </DevPanel>
  )
}
