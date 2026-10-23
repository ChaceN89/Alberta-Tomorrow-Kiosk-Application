/**
 * File: ApplicationStatePanel.tsx | Author: Chace Nielson
 * Created: 2026-10-23 | Updated: 2026-10-23
 * Description: Preview startup and activity loading/error screens on demand.
 * Dependencies: SplashScreen, Loading, react-i18next.
 */
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Loading } from '../../Loading'
import { SplashScreen } from '../../SplashScreen'
import { DevPanel } from './DevPanel'

type ApplicationStatePanelProps = {
  onClose: () => void
}

type PreviewState =
  'startupLoading' | 'startupError' | 'activityLoading' | 'activityError' | null

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
    <div className="fixed inset-0 z-[120] grid place-items-center bg-ink/50 p-6">
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
        className="fixed top-4 right-4 z-[130] flex size-12 items-center justify-center rounded-full bg-surface text-2xl text-ink shadow-lg"
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
