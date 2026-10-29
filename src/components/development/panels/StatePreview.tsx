/**
  File: StatePreview.tsx | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Show a contained, dismissible preview of a startup or activity state.

  Usage:
  - Rendered by ApplicationStatePanel when a preview is selected.

  Notes:
  - None.
 */
import { useEffect, useId, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import logo from '@/assets/expedition.svg'
import { Loading } from '@/components/app-states/Loading'

export type PreviewState =
  'startupLoading' | 'startupError' | 'activityLoading' | 'activityError'

type StatePreviewProps = {
  state: PreviewState
  onClose: () => void
}

const previewTitleKeys = {
  startupLoading: 'previewStartupLoading',
  startupError: 'previewStartupError',
  activityLoading: 'previewActivityLoading',
  activityError: 'previewActivityError',
} as const satisfies Record<PreviewState, string>

export function StatePreview({ state, onClose }: StatePreviewProps) {
  const { t: tGlobal } = useTranslation('global')
  const { t } = useTranslation('development')
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const isLoading = state === 'startupLoading' || state === 'activityLoading'

  useEffect(() => {
    const dialog = dialogRef.current

    if (dialog && !dialog.open) dialog.showModal()
  }, [])

  const closePreview = () => {
    if (dialogRef.current?.open) {
      dialogRef.current.close()
    } else {
      onClose()
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className="m-auto h-[min(36rem,calc(100dvh-2rem))] max-h-[calc(100dvh-2rem)] w-[min(42rem,calc(100vw-2rem))] max-w-none overflow-hidden rounded-2xl border border-line bg-surface p-0 text-ink shadow-2xl backdrop:bg-ink/60"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) closePreview()
      }}
    >
      <div className="flex h-full flex-col">
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-6">
          <h2 id={titleId} className="text-lg">
            {t(previewTitleKeys[state])}
          </h2>
          <button
            type="button"
            className="flex size-10 shrink-0 items-center justify-center rounded-full text-xl text-muted hover:bg-canvas"
            aria-label={t('closePreview')}
            onClick={closePreview}
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>
        <div className="grid min-h-0 flex-1 place-items-center overflow-y-auto bg-canvas p-4 sm:p-6">
          {state === 'startupLoading' ? (
            <div className="flex flex-col items-center px-4 text-center">
              <img src={logo} alt="" className="mb-4 size-14" />
              <h1 className="text-2xl font-bold text-pine">
                {tGlobal('app.name')}
              </h1>
              <Loading label={tGlobal('app.startupLoading')} />
            </div>
          ) : isLoading ? (
            <Loading label={tGlobal('preload.preparing')} />
          ) : (
            <section
              role="alert"
              className="w-full max-w-lg rounded-2xl border border-line bg-surface p-5 text-center sm:p-8"
            >
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
              <button type="button" className="button" onClick={closePreview}>
                {tGlobal('app.retry')}
              </button>
            </section>
          )}
        </div>
      </div>
    </dialog>
  )
}
