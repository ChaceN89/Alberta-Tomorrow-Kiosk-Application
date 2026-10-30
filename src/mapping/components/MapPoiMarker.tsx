/**
  File: MapPoiMarker.tsx | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Render an accessible, titled point-of-interest marker on the map.

  Usage:
  - Used for default and module-specific map locations.

  Notes:
  - Optional details are opened through the shared map info panel tool.
 */
import { Marker } from 'react-map-gl/maplibre'
import type { ReactNode } from 'react'
import { useMapInfoPanel } from '@/module-tools/map-info-panel/hooks/useMapInfoPanel'

export type MapPoi = {
  id: string
  coordinates: [number, number]
  title: string
  info?: ReactNode
  isActive?: boolean
  isComplete?: boolean
  onActivate?: () => void
}

export function MapPoiMarker({
  id,
  coordinates,
  title,
  info,
  isActive = false,
  isComplete = false,
  onActivate,
}: MapPoi) {
  const { openPanel, closePanel } = useMapInfoPanel()

  return (
    <Marker
      longitude={coordinates[0]}
      latitude={coordinates[1]}
      anchor="bottom"
      pitchAlignment="viewport"
    >
      <button
        type="button"
        className="mapping-poi-marker"
        data-poi-id={id}
        data-active={isActive}
        data-complete={isComplete}
        aria-label={title}
        title={title}
        onClick={(event) => {
          onActivate?.()
          if (info) {
            openPanel({ title, content: info }, { origin: event.currentTarget })
          } else {
            closePanel({ restoreFocus: false })
          }
        }}
      >
        <svg
          className="mapping-poi-marker__shape"
          viewBox="0 0 320 56"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            className="mapping-poi-marker__bubble"
            d="M18 1h284c9.4 0 17 7.6 17 17v8c0 9.4-7.6 17-17 17H177l-17 12-17-12H18C8.6 43 1 35.4 1 26v-8C1 8.6 8.6 1 18 1Z"
          />
        </svg>
        <span className="mapping-poi-marker__content">
          <span className="mapping-poi-marker__pin" aria-hidden="true" />
          <span className="mapping-poi-marker__title">{title}</span>
          {isComplete && (
            <span className="mapping-poi-marker__complete" aria-hidden="true">
              ✓
            </span>
          )}
        </span>
      </button>
    </Marker>
  )
}
