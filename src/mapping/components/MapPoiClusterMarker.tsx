/**
  File: MapPoiClusterMarker.tsx | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Render an accessible count marker for nearby POIs.

  Usage:
  - Rendered by AlbertaMap when multiple visible POIs cluster together.

  Notes:
  - Selecting a cluster zooms the map toward its individual POIs.
 */
import { Marker } from 'react-map-gl/maplibre'
import { useTranslation } from 'react-i18next'

type MapPoiClusterMarkerProps = {
  coordinates: [number, number]
  count: number
  isActive: boolean
  onClick: () => void
}

export function MapPoiClusterMarker({
  coordinates,
  count,
  isActive,
  onClick,
}: MapPoiClusterMarkerProps) {
  const { t } = useTranslation('mapping')
  const label = t('poiCluster.select', { count })

  return (
    <Marker
      longitude={coordinates[0]}
      latitude={coordinates[1]}
      anchor="center"
      pitchAlignment="viewport"
    >
      <button
        type="button"
        className="mapping-poi-cluster-marker"
        data-active={isActive}
        aria-label={label}
        title={label}
        onClick={onClick}
      >
        {count}
      </button>
    </Marker>
  )
}
