/**
  File: FlyoverTelemetry.tsx | Author: Chace Nielson
  Date Created: Nov 5, 2026
  Date Updated: Nov 5, 2026

  Description:
  - Show the current flight altitude and speed in a compact map HUD.

  Usage:
  - Rendered by PlaneHud while flyover mode is active.

  Notes:
  - Values are rounded by the flyover controller before they reach this component.
 */
import { useTranslation } from 'react-i18next'

type FlyoverTelemetryProps = {
  altitudeMeters: number
  speedMetersPerSecond: number
}

export function FlyoverTelemetry({
  altitudeMeters,
  speedMetersPerSecond,
}: FlyoverTelemetryProps) {
  const { t, i18n } = useTranslation('mapping')
  const formatNumber = (value: number) =>
    value.toLocaleString(i18n.resolvedLanguage)

  return (
    <section
      className="plane-hud__telemetry"
      aria-label={t('flyover.telemetryLabel')}
      aria-live="off"
    >
      <p>
        <span>{t('flyover.altitudeLabel')}: </span>
        <strong>
          {t('flyover.metersValue', { value: formatNumber(altitudeMeters) })}
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
    </section>
  )
}
