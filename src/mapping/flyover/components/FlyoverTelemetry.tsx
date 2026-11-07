/**
  File: FlyoverTelemetry.tsx | Author: Chace Nielson
  Date Created: Nov 5, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Show the map center coordinates and, during flyover, altitude and speed.

  Usage:
  - Rendered by PlaneHud whenever the map is displayed.

  Notes:
  - Coordinates are shown in latitude, longitude order at five-decimal precision.
 */
import { useTranslation } from 'react-i18next'

type FlyoverTelemetryProps = {
  isFlightActive: boolean
  altitudeMeters: number
  speedMetersPerSecond: number
  latitude: number
  longitude: number
}

export function FlyoverTelemetry({
  isFlightActive,
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
    <section
      className="plane-hud__telemetry"
      aria-label={t(
        isFlightActive
          ? 'flyover.telemetryLabel'
          : 'flyover.mapCoordinatesLabel',
      )}
      aria-live="off"
    >
      {isFlightActive && (
        <p>
          <span>{t('flyover.altitudeLabel')}: </span>
          <strong>
            {t('flyover.metersValue', { value: formatNumber(altitudeMeters) })}
          </strong>
        </p>
      )}
      {isFlightActive && (
        <p>
          <span>{t('flyover.speedLabel')}: </span>
          <strong>
            {t('flyover.speedValue', {
              value: formatNumber(speedMetersPerSecond),
            })}
          </strong>
        </p>
      )}
      <p>
        <span>{t('flyover.latitudeLabel')}: </span>
        <strong>{formatCoordinate(latitude)}°</strong>
      </p>
      <p>
        <span>{t('flyover.longitudeLabel')}: </span>
        <strong>{formatCoordinate(longitude)}°</strong>
      </p>
    </section>
  )
}
