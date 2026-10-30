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
        <span className="mapping-poi-marker__shape" aria-hidden="true">
          <span className="mapping-poi-marker__tail">
            <svg viewBox="0 0 28 16" aria-hidden="true">
              <path
                className="mapping-poi-marker__tail-fill"
                d="M0 0h28L14 16Z"
              />
              <path
                className="mapping-poi-marker__tail-outline"
                d="M0 2 14 16 28 2"
              />
            </svg>
          </span>
          <span className="mapping-poi-marker__bubble" />
        </span>
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
