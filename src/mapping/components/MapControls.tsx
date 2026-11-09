/**
  File: MapControls.tsx | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Render accessible controls for map appearance and camera settings.

  Usage:
  - Rendered in the explore-map heading panel from AlbertaMap state.

  Notes:
  - Map behavior and settings remain owned by AlbertaMap.
 */
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { BASEMAP_STYLES } from '../map-settings/baseMapSettings'
import {
  TERRAIN_EXAGGERATION_MAX,
  TERRAIN_EXAGGERATION_MIN,
  TERRAIN_EXAGGERATION_STEP,
} from '../map-settings/terrainSettings'
import {
  MAX_POI_CLUSTER_RADIUS,
  MIN_POI_CLUSTER_RADIUS,
  POI_CLUSTER_RADIUS_STEP,
} from '../map-settings/poiClusterSettings'
import { useMapControls } from './MapControlsContext'

export function MapControls() {
  const controls = useMapControls()
  const {
    hasMapError,
    isMapReady,
    isStyleLoading,
    isResettingMap,
    terrainExaggeration,
    basemapStyleId,
    isHillshadeEnabled,
    isAlbertaBoundaryEnabled,
    defaultPoisVisible,
    modulePoisVisible,
    hasModulePois,
    poiClusterRadius,
    onTerrainExaggerationChange,
    onBasemapStyleChange,
    onHillshadeChange,
    onAlbertaBoundaryChange,
    onDefaultPoisChange,
    onModulePoisChange,
    onPoiClusterRadiusChange,
  } = controls
  const { t } = useTranslation('mapping')
  const basemapSelectId = useId()
  const basemapHelpId = useId()
  const exaggerationId = useId()
  const exaggerationHelpId = useId()
  const hillshadeId = useId()
  const albertaBoundaryId = useId()
  const defaultPoisId = useId()
  const modulePoisId = useId()
  const poiClusterRadiusId = useId()
  const isDisabled = !isMapReady || isStyleLoading || isResettingMap

  return (
    <section
      className="mapping-controls mapping-controls--floating"
      aria-label={t('view.controls')}
    >
      {hasMapError && (
        <p className="mapping-controls__error" role="alert">
          {t('terrain.loadError')}
        </p>
      )}

      <details className="mapping-controls__disclosure">
        <summary className="mapping-controls__summary">
          {t('view.title')}
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="mapping-controls__chevron"
          >
            <path d="m5 7.5 5 5 5-5" />
          </svg>
        </summary>

        <div className="mapping-controls__settings">
          <div className="mapping-controls__field">
            <label
              className="mapping-controls__label"
              htmlFor={basemapSelectId}
            >
              {t('view.basemapLabel')}
            </label>
            <select
              id={basemapSelectId}
              className="mapping-controls__select"
              value={basemapStyleId}
              disabled={isDisabled}
              aria-describedby={basemapHelpId}
              onChange={(event) =>
                onBasemapStyleChange(event.currentTarget.value)
              }
            >
              {BASEMAP_STYLES.map((style) => (
                <option key={style.id} value={style.id}>
                  {t(style.labelKey)}
                </option>
              ))}
            </select>
            <p id={basemapHelpId} className="mapping-controls__help">
              {t('view.basemapHelp')}
            </p>
          </div>

          <label
            className="mapping-controls__check"
            htmlFor={albertaBoundaryId}
          >
            <input
              id={albertaBoundaryId}
              type="checkbox"
              checked={isAlbertaBoundaryEnabled}
              disabled={isDisabled}
              onChange={(event) =>
                onAlbertaBoundaryChange(event.currentTarget.checked)
              }
            />
            <span className="mapping-controls__check-copy">
              <span className="mapping-controls__label">
                {t('view.albertaBoundaryLabel')}
              </span>
              <span className="mapping-controls__help">
                {t('view.albertaBoundaryHelp')}
              </span>
            </span>
          </label>

          <label className="mapping-controls__check" htmlFor={defaultPoisId}>
            <input
              id={defaultPoisId}
              type="checkbox"
              checked={defaultPoisVisible ?? true}
              disabled={isDisabled}
              onChange={(event) =>
                onDefaultPoisChange?.(event.currentTarget.checked)
              }
            />
            <span className="mapping-controls__check-copy">
              <span className="mapping-controls__label">
                {t('view.defaultPoisLabel')}
              </span>
              <span className="mapping-controls__help">
                {t('view.defaultPoisHelp')}
              </span>
            </span>
          </label>

          {hasModulePois && (
            <label className="mapping-controls__check" htmlFor={modulePoisId}>
              <input
                id={modulePoisId}
                type="checkbox"
                checked={modulePoisVisible ?? true}
                disabled={isDisabled}
                onChange={(event) =>
                  onModulePoisChange?.(event.currentTarget.checked)
                }
              />
              <span className="mapping-controls__check-copy">
                <span className="mapping-controls__label">
                  {t('view.expeditionPoisLabel')}
                </span>
                <span className="mapping-controls__help">
                  {t('view.expeditionPoisHelp')}
                </span>
              </span>
            </label>
          )}

          <div className="mapping-controls__field">
            <div className="mapping-controls__range-heading">
              <label
                className="mapping-controls__label"
                htmlFor={poiClusterRadiusId}
              >
                {t('view.poiClusterRadiusLabel')}
              </label>
              <output htmlFor={poiClusterRadiusId}>
                {poiClusterRadius === 0
                  ? t('view.poiClusterRadiusOff')
                  : t('view.poiClusterRadiusValue', {
                      value: poiClusterRadius,
                    })}
              </output>
            </div>
            <input
              id={poiClusterRadiusId}
              className="mapping-controls__range"
              type="range"
              min={MIN_POI_CLUSTER_RADIUS}
              max={MAX_POI_CLUSTER_RADIUS}
              step={POI_CLUSTER_RADIUS_STEP}
              value={poiClusterRadius}
              disabled={isDisabled}
              onChange={(event) =>
                onPoiClusterRadiusChange(Number(event.currentTarget.value))
              }
            />
            <p className="mapping-controls__help">
              {t('view.poiClusterRadiusHelp')}
            </p>
          </div>

          <label className="mapping-controls__check" htmlFor={hillshadeId}>
            <input
              id={hillshadeId}
              type="checkbox"
              checked={isHillshadeEnabled}
              disabled={isDisabled}
              onChange={(event) =>
                onHillshadeChange(event.currentTarget.checked)
              }
            />
            <span className="mapping-controls__check-copy">
              <span className="mapping-controls__label">
                {t('view.hillshadeLabel')}
              </span>
              <span className="mapping-controls__help">
                {t('view.hillshadeHelp')}
              </span>
            </span>
          </label>

          <div className="mapping-controls__field">
            <div className="mapping-controls__range-heading">
              <label
                className="mapping-controls__label"
                htmlFor={exaggerationId}
              >
                {t('view.exaggerationLabel')}
              </label>
              <output htmlFor={exaggerationId}>
                {t('view.exaggerationValue', { value: terrainExaggeration })}
              </output>
            </div>
            <input
              id={exaggerationId}
              className="mapping-controls__range"
              type="range"
              min={TERRAIN_EXAGGERATION_MIN}
              max={TERRAIN_EXAGGERATION_MAX}
              step={TERRAIN_EXAGGERATION_STEP}
              value={terrainExaggeration}
              disabled={isDisabled}
              aria-describedby={exaggerationHelpId}
              onChange={(event) =>
                onTerrainExaggerationChange(Number(event.currentTarget.value))
              }
            />
            <p id={exaggerationHelpId} className="mapping-controls__help">
              {t('view.exaggerationHelp')}
            </p>
          </div>
        </div>
      </details>
    </section>
  )
}
