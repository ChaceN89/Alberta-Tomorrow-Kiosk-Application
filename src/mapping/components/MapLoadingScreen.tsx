/**
  File: MapLoadingScreen.tsx | Author: Chace Nielson
  Date Created: Nov 9, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Cover an unfinished map with localized loading and recovery actions.

  Usage:
  - Rendered alongside the mounted, non-interactive map during startup.

  Notes:
  - Retry remounts only the map, preserving learner progress.
 */
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { MAP_REVEAL_DURATION_MS } from '../map-settings/mapLoadingSettings'

type MapLoadingScreenProps = {
  hasError: boolean
  isRevealing: boolean
  onRetry: () => void
}

export function MapLoadingScreen({
  hasError,
  isRevealing,
  onRetry,
}: MapLoadingScreenProps) {
  const { t } = useTranslation('mapping')
  return (
    <div
      className={`absolute inset-0 z-(--z-splash) flex items-center justify-center bg-canvas p-6 text-ink transition-opacity motion-reduce:transition-none ${isRevealing ? 'opacity-0' : 'opacity-100'}`}
      style={{ transitionDuration: `${MAP_REVEAL_DURATION_MS}ms` }}
      data-map-loading={hasError ? 'error' : 'loading'}
    >
      <div className="max-w-md space-y-4 text-center">
        {!hasError && (
          <div
            aria-hidden="true"
            className="mx-auto size-10 animate-spin rounded-full border-4 border-line border-t-pine motion-reduce:animate-none"
          />
        )}
        <h2 className="text-xl font-bold">
          {t(hasError ? 'loading.errorTitle' : 'loading.title')}
        </h2>
        <p role={hasError ? 'alert' : 'status'}>
          {t(hasError ? 'loading.errorDescription' : 'loading.description')}
        </p>
        {hasError && (
          <button type="button" className="button min-h-12" onClick={onRetry}>
            {t('loading.retry')}
          </button>
        )}
        <Link to="/" className="button-secondary min-h-12">
          {t('loading.back')}
        </Link>
      </div>
    </div>
  )
}
