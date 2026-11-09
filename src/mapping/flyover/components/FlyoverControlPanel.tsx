/**
  File: FlyoverControlPanel.tsx | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Show flight controls in a vertically centered, collapsible map panel.

  Usage:
  - Rendered by PlaneHud while flyover mode is active.

  Notes:
  - The controls stay mounted while collapsed so they can slide in and out.
 */
import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { GloveIcon } from '@/components/icons/GloveIcon'

type FlyoverControlPanelProps = {
  isTutorialActive: boolean
  isTutorialControlsStep: boolean
}

const CONTROLS = [
  { key: 'W', labelKey: 'flyover.controls.descend' },
  { key: 'S', labelKey: 'flyover.controls.climb' },
  { key: 'A', labelKey: 'flyover.controls.left' },
  { key: 'D', labelKey: 'flyover.controls.right' },
  { key: 'drag', labelKey: 'flyover.controls.drag' },
  { key: 'rightMouse', labelKey: 'flyover.controls.freeLook' },
  { key: 'wheel', labelKey: 'flyover.controls.zoom' },
  { key: 'up', labelKey: 'flyover.controls.faster' },
  { key: 'down', labelKey: 'flyover.controls.slower' },
  { key: 'P', labelKey: 'flyover.controls.pause' },
  { key: 'escape', labelKey: 'flyover.controls.exit' },
] as const

export function FlyoverControlPanel({
  isTutorialActive,
  isTutorialControlsStep,
}: FlyoverControlPanelProps) {
  const { t } = useTranslation('mapping')
  const controlsId = useId()
  const [isManuallyExpanded, setIsManuallyExpanded] = useState(false)
  const isExpanded = isTutorialControlsStep || isManuallyExpanded

  if (isTutorialActive && !isTutorialControlsStep) return null

  const getKeyLabel = (key: (typeof CONTROLS)[number]['key']) => {
    switch (key) {
      case 'drag':
        return (
          <span aria-label={t('flyover.keys.drag')}>
            <GloveIcon />
          </span>
        )
      case 'rightMouse':
        return t('flyover.keys.rightMouse')
      case 'wheel':
        return t('flyover.keys.wheel')
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
      data-plane-controls="true"
      className={`mapping-flyover-panel ${
        isExpanded ? '' : 'mapping-flyover-panel--collapsed'
      }`}
      aria-label={t('flyover.panelLabel')}
    >
      <button
        type="button"
        className="mapping-flyover-panel__toggle"
        aria-label={t(
          isExpanded ? 'flyover.hideControls' : 'flyover.showControls',
        )}
        aria-expanded={isExpanded}
        aria-controls={controlsId}
        title={t('flyover.controlsTooltip')}
        onClick={() => setIsManuallyExpanded((expanded) => !expanded)}
      >
        <span className="mapping-flyover-panel__tooltip" aria-hidden="true">
          {t('flyover.controlsTooltip')}
        </span>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="mapping-actions__icon"
        >
          <path d={isExpanded ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'} />
        </svg>
      </button>
      <div
        id={controlsId}
        className="mapping-flyover-panel__content panel bg-surface/95 shadow-xl backdrop-blur"
        aria-hidden={!isExpanded}
        inert={!isExpanded}
      >
        <header className="mapping-flyover-panel__header">
          <h2 className="mapping-flyover-panel__title">{t('flyover.title')}</h2>
        </header>
        <ul className="mapping-flyover-panel__controls">
          {CONTROLS.map(({ key, labelKey }) => (
            <li key={key} className="mapping-flyover-panel__control">
              <kbd className="mapping-flyover-panel__key">
                {getKeyLabel(key)}
              </kbd>
              <span>{t(labelKey)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
