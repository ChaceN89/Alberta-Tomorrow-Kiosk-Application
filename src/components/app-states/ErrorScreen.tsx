/**
 * File: ErrorScreen.tsx | Author: Chace Nielson
 * Created: 2026-10-28 | Updated: 2026-10-28
 * Description: Show the localized application startup error and retry action.
 * Dependencies: react-i18next, global translations.
 */
import { useTranslation } from 'react-i18next'

type ErrorScreenProps = {
  onRetry: () => void
}

export function ErrorScreen({ onRetry }: ErrorScreenProps) {
  const { t } = useTranslation('global')

  return (
    <main className="grid min-h-dvh place-items-center bg-canvas p-6 border-4 border-amber-300">
      <section role="alert" className="panel w-full max-w-lg text-center">
        <h1>{t('app.startupErrorTitle')}</h1>
        <p className="my-4 text-muted">{t('app.startupErrorDescription')}</p>
        <button type="button" className="button" onClick={onRetry}>
          {t('app.retry')}
        </button>
      </section>
    </main>
  )
}
