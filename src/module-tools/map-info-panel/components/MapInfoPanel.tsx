/**
  File: MapInfoPanel.tsx | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Render titled, authored map location content in an anchored panel.

  Usage:
  - Rendered by MapInfoPanelProvider while a POI is selected.

  Notes:
  - Content is rendered as React nodes instead of raw HTML.
 */
import { useTranslation } from 'react-i18next'
import type { MapInfoPanelContent } from '../provider/types'

type MapInfoPanelProps = {
  content: MapInfoPanelContent
  isOpen: boolean
  onClose: () => void
}

export function MapInfoPanel({ content, isOpen, onClose }: MapInfoPanelProps) {
  const { t } = useTranslation('moduleTools')

  return (
    <section
      className={`map-info-panel ${
        isOpen ? 'map-info-panel--open' : 'map-info-panel--closing'
      }`}
      aria-labelledby="map-info-panel-title"
      aria-hidden={!isOpen}
      inert={!isOpen}
    >
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-line px-5 py-4 md:px-6">
        <h2 id="map-info-panel-title" className="text-xl">
          {content.title}
        </h2>
        <button
          type="button"
          className="flex size-12 shrink-0 items-center justify-center rounded-xl text-2xl text-muted hover:bg-canvas"
          aria-label={t('mapInfoPanel.close')}
          onClick={onClose}
        >
          <span aria-hidden="true">×</span>
        </button>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto p-5 md:p-6">
        {content.content}
      </div>
    </section>
  )
}
