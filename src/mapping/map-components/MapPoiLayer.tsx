/**
  File: MapPoiLayer.tsx | Author: Chace Nielson
  Date Created: Nov 8, 2026
  Date Updated: Nov 8, 2026

  Description:
  - Render individual POI markers and clustered POI markers.

  Usage:
  - Rendered inside the MapLibre canvas by AlbertaMapCanvas.

  Notes:
  - Marker activation and cluster zoom behavior stay with the map coordinator.
 */
import { MapPoiClusterMarker } from '../components/MapPoiClusterMarker'
import { MapPoiMarker, type MapPoi } from '../components/MapPoiMarker'
import type { PoiRenderGroup } from '../map-functions/clusterMapPois'

export type MapPoiLayerProps = {
  groups: readonly PoiRenderGroup[]
  activePoiId: string | null
  onPoiActivate: (poi: MapPoi, origin?: Element | null) => void
  onClusterActivate: (
    coordinates: [number, number],
    expansionZoom: number,
  ) => void
}

export function MapPoiLayer({
  groups,
  activePoiId,
  onPoiActivate,
  onClusterActivate,
}: MapPoiLayerProps) {
  return groups.map((group) => {
    if (group.type === 'cluster') {
      return (
        <MapPoiClusterMarker
          key={group.id}
          coordinates={group.coordinates}
          count={group.pois.length}
          isActive={group.pois.some((poi) => poi.id === activePoiId)}
          onClick={() =>
            onClusterActivate(group.coordinates, group.expansionZoom)
          }
        />
      )
    }

    const { poi } = group

    return (
      <MapPoiMarker
        key={group.id}
        {...poi}
        isActive={poi.id === activePoiId}
        onActivate={(origin) => onPoiActivate(poi, origin)}
      />
    )
  })
}
