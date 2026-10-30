/**
  File: MapActionControls.tsx | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Oct 30, 2026 - CN - Replace POI shortcuts with a dropdown.

  Description:
  - Render the terrain mode switch and an Alberta point-of-interest selector.

  Usage:
  - Rendered at the bottom-left of each explore map.

  Notes:
  - Map actions are provided by AlbertaMap through MapControlsContext.
 */
import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  DEFAULT_POI_SETTINGS,
  isDefaultPoiId,
} from '../map-settings/defaultPOISettings'
import { useMapControls } from './MapControlsContext'

export function MapActionControls() {
  const {
    isMapReady,
    isStyleLoading,
    isTerrainEnabled,
    isTerrainTransitioning,
    onToggleTerrain,
    onNavigateToPoi,
  } = useMapControls()
  const { t } = useTranslation('mapping')
  const poiSelectId = useId()
  const [selectedPoi, setSelectedPoi] = useState('')
  const isDisabled = !isMapReady || isStyleLoading || isTerrainTransitioning
  const switchLabel = t(
    isTerrainEnabled ? 'terrain.switchTo2d' : 'terrain.switchTo3d',
  )

  return (
    <section className="mapping-actions" aria-label={t('view.actions')}>
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

      <div className="mapping-actions__poi-picker">
        <label className="sr-only" htmlFor={poiSelectId}>
          {t('view.poiLabel')}
        </label>
        <select
          id={poiSelectId}
          className="mapping-actions__poi-select"
          value={selectedPoi}
          disabled={isDisabled}
          onChange={(event) => {
            const poiId = event.currentTarget.value
            setSelectedPoi('')
            if (isDefaultPoiId(poiId)) onNavigateToPoi(poiId)
          }}
        >
          <option value="">{t('view.poiLabel')}</option>
          {DEFAULT_POI_SETTINGS.map((poi) => (
            <option key={poi.id} value={poi.id}>
              {t(poi.labelKey)}
            </option>
          ))}
        </select>
      </div>
    </section>
  )
}
