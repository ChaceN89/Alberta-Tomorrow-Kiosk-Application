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
import { useTranslation } from 'react-i18next'
import { useJournal } from '@/journal/useJournal'
import { DevPanel } from './DevPanel'
import { StatePreview, type PreviewState } from './StatePreview'
import { ToastPreviewGroups } from './ToastPreviewGroups'

type ApplicationStatePanelProps = {
  onClose: () => void
}

export function ApplicationStatePanel({ onClose }: ApplicationStatePanelProps) {
  const { t } = useTranslation('development')
  const { openJournal } = useJournal()
  const [previewState, setPreviewState] = useState<PreviewState | null>(null)

  return (
    <>
      <DevPanel title={t('applicationStates')} onBack={onClose}>
        <p className="mb-3 text-sm text-muted">
          {t('applicationStatesDescription')}
        </p>
        <section aria-labelledby="dev-startup-previews" className="space-y-2">
          <h3 id="dev-startup-previews" className="font-semibold text-muted">
            {t('startupPreviews')}
          </h3>
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
          </div>
        </section>
        <section
          aria-labelledby="dev-activity-previews"
          className="mt-4 space-y-2"
        >
          <h3 id="dev-activity-previews" className="font-semibold text-muted">
            {t('activityPreviews')}
          </h3>
          <div className="grid gap-2">
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
        </section>
        <ToastPreviewGroups openJournal={openJournal} />
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
