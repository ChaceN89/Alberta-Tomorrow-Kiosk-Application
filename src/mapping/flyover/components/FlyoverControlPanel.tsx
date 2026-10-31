/**
  File: FlyoverControlPanel.tsx | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Show the flyover title, flight controls, and the current altitude, speed, and pause status.

  Usage:
  - Rendered on the left side of the map by AlbertaMap while flyover mode is active.

  Notes:
  - The keys listed here are read by useFlightInput; dragging is read by useFlightDrag.
 */
import { useTranslation } from 'react-i18next'

type FlyoverControlPanelProps = {
  isPaused: boolean
  altitudeMeters: number
  speedMetersPerSecond: number
}

const CONTROLS = [
  { key: 'W', labelKey: 'flyover.controls.descend' },
  { key: 'S', labelKey: 'flyover.controls.climb' },
  { key: 'A', labelKey: 'flyover.controls.left' },
  { key: 'D', labelKey: 'flyover.controls.right' },
  { key: 'drag', labelKey: 'flyover.controls.drag' },
  { key: 'up', labelKey: 'flyover.controls.faster' },
  { key: 'down', labelKey: 'flyover.controls.slower' },
  { key: 'P', labelKey: 'flyover.controls.pause' },
  { key: 'escape', labelKey: 'flyover.controls.exit' },
] as const

export function FlyoverControlPanel({
  isPaused,
  altitudeMeters,
  speedMetersPerSecond,
}: FlyoverControlPanelProps) {
  const { t, i18n } = useTranslation('mapping')

  // Function: The text shown on a key for a control.
  const getKeyLabel = (key: (typeof CONTROLS)[number]['key']) => {
    switch (key) {
      case 'drag':
        return t('flyover.keys.drag')
      case 'up':
        return '↑'
      case 'down':
        return '↓'
      case 'escape':
        return t('flyover.keys.escape')
      default:
        return key
    }
  }

  return (
    <section
      className="mapping-flyover-panel panel bg-surface/95 shadow-xl backdrop-blur"
      aria-label={t('flyover.panelLabel')}
    >
      <div className="mapping-flyover-panel__header">
        <h2 className="mapping-flyover-panel__title">{t('flyover.title')}</h2>
        <p className="mapping-flyover-panel__reading">
          {t('flyover.altitude', {
            meters: altitudeMeters.toLocaleString(i18n.language),
          })}
        </p>
        <p className="mapping-flyover-panel__reading">
          {t('flyover.speed', {
            speed: speedMetersPerSecond.toLocaleString(i18n.language),
          })}
        </p>
        <p className="mapping-flyover-panel__badges" role="status">
          {isPaused && (
            <strong className="mapping-flyover-panel__badge">
              {t('flyover.paused')}
            </strong>
          )}
        </p>
      </div>
      <ul className="mapping-flyover-panel__controls">
        {CONTROLS.map(({ key, labelKey }) => (
          <li key={key} className="mapping-flyover-panel__control">
            <kbd className="mapping-flyover-panel__key">{getKeyLabel(key)}</kbd>
            <span>{t(labelKey)}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
