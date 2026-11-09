/**
  File: FlyoverTelemetry.tsx | Author: Chace Nielson
  Date Created: Nov 5, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Show the map center coordinates and, during flyover, altitude and speed.

  Usage:
  - Rendered by PlaneHud whenever the map is displayed.

  Notes:
  - Coordinates are shown in latitude, longitude order at five-decimal precision.
  - Both map and flight readings share the same bottom-centered layout.
 */
import { useTranslation } from 'react-i18next'

type FlyoverTelemetryProps = {
  isFlightActive: boolean
  isPaused: boolean
  altitudeMeters: number
  speedMetersPerSecond: number
  latitude: number
  longitude: number
}

export function FlyoverTelemetry({
  isFlightActive,
  isPaused,
  altitudeMeters,
  speedMetersPerSecond,
  latitude,
  longitude,
}: FlyoverTelemetryProps) {
  const { t, i18n } = useTranslation('mapping')
  const formatNumber = (value: number) =>
    value.toLocaleString(i18n.resolvedLanguage)
  const formatCoordinate = (value: number) => value.toFixed(5)

  return (
    <>
      <section
        className="plane-hud__telemetry"
        data-flight-active={isFlightActive}
        aria-label={t(
          isFlightActive
            ? 'flyover.telemetryLabel'
            : 'flyover.mapCoordinatesLabel',
        )}
        aria-live="off"
      >
        <div className="plane-hud__readings">
          <div
            className="plane-hud__flight-readings"
            aria-hidden={!isFlightActive}
          >
            <p>
              <span>{t('flyover.altitudeLabel')}: </span>
              <strong>
                {t('flyover.metersValue', {
                  value: formatNumber(altitudeMeters),
                })}
              </strong>
            </p>
            <p>
              <span>{t('flyover.speedLabel')}: </span>
              <strong>
                {t('flyover.speedValue', {
                  value: formatNumber(speedMetersPerSecond),
                })}
              </strong>
            </p>
          </div>
          <p>
            <span>{t('flyover.latitudeLabel')}: </span>
            <strong>{formatCoordinate(latitude)}°</strong>
          </p>
          <p>
            <span>{t('flyover.longitudeLabel')}: </span>
            <strong>{formatCoordinate(longitude)}°</strong>
          </p>
        </div>
      </section>
      {isFlightActive && isPaused && (
        <div className="plane-hud__pause" role="status">
          <strong className="mapping-flyover-panel__badge">
            {t('flyover.paused')}
          </strong>
        </div>
      )}
    </>
  )
}
