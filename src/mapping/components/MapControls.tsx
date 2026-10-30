/**
  File: MapControls.tsx | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Oct 30, 2026

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
import { ZOOM_MAX, ZOOM_MIN } from '../map-settings/mapSettings'
import {
  MAX_CAMERA_PITCH,
  TERRAIN_EXAGGERATION_MAX,
  TERRAIN_EXAGGERATION_MIN,
} from '../map-settings/terrainSettings'
import { useMapControls } from './MapControlsContext'

export function MapControls() {
  const controls = useMapControls()
  const {
    hasMapError,
    isMapReady,
    isStyleLoading,
    isTerrainEnabled,
    isTerrainTransitioning,
    terrainExaggeration,
    basemapStyleId,
    isHillshadeEnabled,
    isSatelliteEnabled,
    isBasemapPlacesEnabled,
    isAlbertaBoundaryEnabled,
    defaultPoisVisible,
    modulePoisVisible,
    hasModulePois,
    cameraPitch,
    cameraZoom,
    onTerrainExaggerationChange,
    onBasemapStyleChange,
    onHillshadeChange,
    onSatelliteChange,
    onBasemapPlacesChange,
    onAlbertaBoundaryChange,
    onDefaultPoisChange,
    onModulePoisChange,
    onCameraPitchChange,
    onCameraZoomChange,
  } = controls
  const { t } = useTranslation('mapping')
  const basemapSelectId = useId()
  const basemapHelpId = useId()
  const exaggerationId = useId()
  const exaggerationHelpId = useId()
  const hillshadeId = useId()
  const satelliteId = useId()
  const basemapPlacesId = useId()
  const albertaBoundaryId = useId()
  const defaultPoisId = useId()
  const modulePoisId = useId()
  const pitchId = useId()
  const zoomId = useId()
  const isDisabled = !isMapReady || isStyleLoading
  const isTerrainControlDisabled = isDisabled || isTerrainTransitioning

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
                  {t('view.modulePoisLabel')}
                </span>
                <span className="mapping-controls__help">
                  {t('view.modulePoisHelp')}
                </span>
              </span>
            </label>
          )}

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

          <label className="mapping-controls__check" htmlFor={basemapPlacesId}>
            <input
              id={basemapPlacesId}
              type="checkbox"
              checked={isBasemapPlacesEnabled}
              disabled={isDisabled}
              onChange={(event) =>
                onBasemapPlacesChange(event.currentTarget.checked)
              }
            />
            <span className="mapping-controls__check-copy">
              <span className="mapping-controls__label">
                {t('view.basemapPlacesLabel')}
              </span>
              <span className="mapping-controls__help">
                {t('view.basemapPlacesHelp')}
              </span>
            </span>
          </label>

          <label className="mapping-controls__check" htmlFor={satelliteId}>
            <input
              id={satelliteId}
              type="checkbox"
              checked={isSatelliteEnabled}
              disabled={isDisabled}
              onChange={(event) =>
                onSatelliteChange(event.currentTarget.checked)
              }
            />
            <span className="mapping-controls__check-copy">
              <span className="mapping-controls__label">
                {t('view.satelliteLabel')}
              </span>
              <span className="mapping-controls__help">
                {t('view.satelliteHelp')}
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
              step="1"
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

          <div className="mapping-controls__field">
            <div className="mapping-controls__range-heading">
              <label className="mapping-controls__label" htmlFor={pitchId}>
                {t('view.pitchLabel')}
              </label>
              <output htmlFor={pitchId}>
                {t('view.pitchValue', { value: cameraPitch })}
              </output>
            </div>
            <input
              id={pitchId}
              className="mapping-controls__range"
              type="range"
              min="0"
              max={MAX_CAMERA_PITCH}
              step="5"
              value={cameraPitch}
              disabled={isTerrainControlDisabled || !isTerrainEnabled}
              onChange={(event) =>
                onCameraPitchChange(Number(event.currentTarget.value))
              }
            />
            <p className="mapping-controls__help">{t('view.pitchHelp')}</p>
          </div>

          <div className="mapping-controls__field">
            <div className="mapping-controls__range-heading">
              <label className="mapping-controls__label" htmlFor={zoomId}>
                {t('view.zoomLabel')}
              </label>
              <output htmlFor={zoomId}>
                {t('view.zoomValue', { value: cameraZoom })}
              </output>
            </div>
            <input
              id={zoomId}
              className="mapping-controls__range"
              type="range"
              min={ZOOM_MIN}
              max={ZOOM_MAX}
              step="1"
              value={cameraZoom}
              disabled={isDisabled}
              onChange={(event) =>
                onCameraZoomChange(Number(event.currentTarget.value))
              }
            />
            <p className="mapping-controls__help">{t('view.zoomHelp')}</p>
          </div>
        </div>
      </details>
    </section>
  )
}
