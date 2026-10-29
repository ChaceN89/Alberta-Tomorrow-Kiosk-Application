/**
  File: SiteFlagsPanel.tsx | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Oct 29, 2026

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
  onStartAllExpeditions: () => void
  onProgressAllNextCheckpoints: () => void
  onCompleteAllModules: () => void
}

export function SiteFlagsPanel({
  onClose,
  onResetSite,
  onResetJournal,
  onStartAllExpeditions,
  onProgressAllNextCheckpoints,
  onCompleteAllModules,
}: SiteFlagsPanelProps) {
  const { t } = useTranslation('development')

  return (
    <DevPanel title={t('siteFlags')} onBack={onClose}>
      <div className="space-y-4">
        <section aria-labelledby="dev-reset-heading" className="space-y-2">
          <h3 id="dev-reset-heading" className="font-semibold text-muted">
            {t('resetGroup')}
          </h3>
          <div className="grid gap-2">
            <button
              type="button"
              className="button-danger w-full"
              onClick={onResetSite}
            >
              {t('resetSite')}
            </button>
            <button
              type="button"
              className="button-danger w-full"
              onClick={onResetJournal}
            >
              {t('resetJournal')}
            </button>
          </div>
        </section>
        <section aria-labelledby="dev-set-flags-heading" className="space-y-2">
          <h3 id="dev-set-flags-heading" className="font-semibold text-muted">
            {t('setFlagsGroup')}
          </h3>
          <div className="grid gap-2">
            <button
              type="button"
              className="button-secondary w-full"
              onClick={onStartAllExpeditions}
            >
              {t('startAllExpeditions')}
            </button>
            <button
              type="button"
              className="button-secondary w-full"
              onClick={onProgressAllNextCheckpoints}
            >
              {t('progressAllNextCheckpoints')}
            </button>
            <button
              type="button"
              className="button w-full"
              onClick={onCompleteAllModules}
            >
              {t('setAllModulesComplete')}
            </button>
          </div>
        </section>
      </div>
    </DevPanel>
  )
}
