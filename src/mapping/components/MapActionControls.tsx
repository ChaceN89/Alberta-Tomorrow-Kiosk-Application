/**
  File: MapActionControls.tsx | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Render terrain and flyover mode switches for the explore map.

  Usage:
  - Rendered at the bottom-left of each explore map.

  Notes:
  - Map actions are provided by AlbertaMap through MapControlsContext.
 */
import { useTranslation } from 'react-i18next'
import { useMapControls } from './MapControlsContext'

export function MapActionControls() {
  const {
    isMapReady,
    isStyleLoading,
    isTerrainEnabled,
    isTerrainTransitioning,
    isFlyoverEnabled,
    isFlyoverTransitioning,
    onToggleTerrain,
    onToggleFlyover,
  } = useMapControls()
  const { t } = useTranslation('mapping')
  const isDisabled = !isMapReady || isStyleLoading || isTerrainTransitioning
  const switchLabel = t(
    isTerrainEnabled ? 'terrain.switchTo2d' : 'terrain.switchTo3d',
  )
  const isFlyoverDisabled = isDisabled || isFlyoverTransitioning
  const flyoverLabel = t(
    isFlyoverEnabled ? 'view.disableFlyover' : 'view.enableFlyover',
  )

  return (
    <section className="mapping-actions" aria-label={t('view.actions')}>
      {!isFlyoverEnabled && (
        <button
          type="button"
          className="mapping-actions__button mapping-actions__mode"
          disabled={isDisabled}
          aria-label={switchLabel}
          aria-pressed={isTerrainEnabled}
          onClick={onToggleTerrain}
        >
          {isTerrainEnabled ? (
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
              className="mapping-actions__icon"
            >
              <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3z" />
              <path d="M9 3v15m6-12v15" />
            </svg>
          ) : (
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
              className="mapping-actions__icon"
            >
              <path d="m12 3 9 5-9 5-9-5 9-5Z" />
              <path d="M3 8v8l9 5 9-5V8m-9 5v8" />
            </svg>
          )}
          <span>{t(isTerrainEnabled ? 'view.mode2d' : 'view.mode3d')}</span>
        </button>
      )}
      <button
        type="button"
        className="mapping-actions__button mapping-actions__mode mapping-actions__flyover"
        disabled={isFlyoverDisabled}
        aria-label={flyoverLabel}
        aria-pressed={isFlyoverEnabled}
        onClick={onToggleFlyover}
      >
        {isFlyoverEnabled ? (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
            className="mapping-actions__icon"
          >
            <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3z" />
            <path d="M9 3v15m6-12v15" />
          </svg>
        ) : (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
            className="mapping-actions__icon"
          >
            <path d="M2.5 14.5 21 6l-7.5 16-2.2-6.3-8.8-1.2Z" />
            <path d="m11.3 15.7 5.2-5.2" />
          </svg>
        )}
        <span>{t(isFlyoverEnabled ? 'view.map' : 'view.flyover')}</span>
      </button>
    </section>
  )
}
