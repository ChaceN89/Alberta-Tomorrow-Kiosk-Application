/**
  File: MapPoiMarker.tsx | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Render an accessible, titled point-of-interest marker on the map.

  Usage:
  - Used for default and module-specific map locations.

  Notes:
  - Optional details are opened through the shared map info panel tool.
 */
import { Marker } from 'react-map-gl/maplibre'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { POI_CATEGORY_ICONS } from '@/components/icons/poi-icons'
import type { PoiIconCategory } from '@/components/icons/poi-icons/types'

export type MapPoi = {
  id: string
  coordinates: [number, number]
  title: string
  iconCategory: PoiIconCategory
  info?: ReactNode
  isActive?: boolean
  isComplete?: boolean
  isModulePoi?: boolean
  flyoverRadiusMultiplier?: number
  flyoverCylinderHeightMultiplier?: number
  isInfoOpen?: boolean
  onActivate?: (origin?: Element | null) => void
}

export function MapPoiMarker({
  coordinates,
  opacityWhenCovered,
  ...poi
}: MapPoi & { opacityWhenCovered?: number }) {
  return (
    <Marker
      longitude={coordinates[0]}
      latitude={coordinates[1]}
      anchor="bottom"
      pitchAlignment="viewport"
      opacityWhenCovered={opacityWhenCovered}
      className={
        opacityWhenCovered === 1
          ? 'mapping-poi-marker-host--flyover'
          : undefined
      }
    >
      <MapPoiMarkerButton {...poi} />
    </Marker>
  )
}

export function MapPoiMarkerButton({
  id,
  title,
  iconCategory,
  isActive = false,
  isComplete = false,
  isInfoOpen = false,
  onActivate,
}: Omit<MapPoi, 'coordinates'>) {
  const { t } = useTranslation('mapping')
  const PoiIcon = POI_CATEGORY_ICONS[iconCategory]
  const categoryLabel = t(`poiCategories.${iconCategory}`)
  const accessibleLabel = t('poiMarkerLabel', {
    name: title,
    category: categoryLabel,
  })

  return (
    <button
      type="button"
      className="mapping-poi-marker"
      data-poi-id={id}
      data-active={isActive}
      data-complete={isComplete}
      data-info-open={isInfoOpen}
      aria-expanded={isInfoOpen}
      aria-label={accessibleLabel}
      title={accessibleLabel}
      onClick={(event) => {
        onActivate?.(event.currentTarget)
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
        <PoiIcon className="mapping-poi-marker__icon" />
        <span className="mapping-poi-marker__title">{title}</span>
        {isComplete && (
          <span className="mapping-poi-marker__complete" aria-hidden="true">
            ✓
          </span>
        )}
      </span>
    </button>
  )
}
