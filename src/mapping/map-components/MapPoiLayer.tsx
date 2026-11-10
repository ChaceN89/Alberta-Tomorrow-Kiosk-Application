/**
  File: MapPoiLayer.tsx | Author: Chace Nielson
  Date Created: Nov 8, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Render individual POI markers and clustered POI markers.

  Usage:
  - Rendered inside the MapLibre canvas by AlbertaMapCanvas.

  Notes:
  - Flat, stable marker keys preserve mounted POIs as cluster membership changes.
 */
import { MapPoiClusterMarker } from '../components/MapPoiClusterMarker'
import { MapPoiMarker, type MapPoi } from '../components/MapPoiMarker'
import type { PoiRenderGroup } from '../map-functions/clusterMapPois'

export type MapPoiLayerProps = {
  groups: readonly PoiRenderGroup[]
  activePoiId: string | null
  infoPoiId: string | null
  isPreparingFlyover?: boolean
  onPoiActivate: (poi: MapPoi, origin?: Element | null) => void
  onClusterActivate: (
    coordinates: [number, number],
    expansionZoom: number,
  ) => void
}

export function MapPoiLayer({
  groups,
  activePoiId,
  infoPoiId,
  isPreparingFlyover = false,
  onPoiActivate,
  onClusterActivate,
}: MapPoiLayerProps) {
  return groups.flatMap((group) => {
    if (
      group.type === 'cluster' &&
      !group.pois.some((poi) => poi.id === infoPoiId) &&
      !isPreparingFlyover
    ) {
      return [
        <MapPoiClusterMarker
          key={group.id}
          coordinates={group.coordinates}
          count={group.pois.length}
          isActive={group.pois.some((poi) => poi.id === activePoiId)}
          onClick={() =>
            onClusterActivate(group.coordinates, group.expansionZoom)
          }
        />,
      ]
    }

    return (group.type === 'cluster' ? group.pois : [group.poi]).map((poi) => (
      <MapPoiMarker
        key={poi.id}
        {...poi}
        isActive={poi.id === activePoiId}
        isInfoOpen={poi.id === infoPoiId}
        opacityWhenCovered={isPreparingFlyover ? 1 : undefined}
        onActivate={(origin) => onPoiActivate(poi, origin)}
      />
    ))
  })
}
