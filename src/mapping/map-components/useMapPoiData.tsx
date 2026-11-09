/**
  File: useMapPoiData.ts | Author: Chace Nielson
  Date Created: Nov 8, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Build translated POI data and manage visibility, clustering, and readiness.

  Usage:
  - Used by AlbertaMap to prepare the POIs rendered by AlbertaMapCanvas.

  Notes:
  - Module POIs replace matching base POI content while retaining base entries.
 */
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Map as MapLibreMap } from 'maplibre-gl'
import { BASE_POI_LIST } from '@/mapping/POIs/BasePOIList'
import type { MapPoi } from '../components/MapPoiMarker'
import { clusterMapPois } from '../map-functions/clusterMapPois'
import { DEFAULT_POI_CLUSTER_RADIUS } from '../map-settings/poiClusterSettings'
import type { MapViewport } from './useMapViewport'

type UseMapPoiDataOptions = {
  modulePois: readonly MapPoi[]
  defaultPoisVisible: boolean
  modulePoisVisible: boolean
  mapInstance: MapLibreMap | null
  hasMapError: boolean
  mapViewport: MapViewport | null
}

export function useMapPoiData({
  modulePois,
  defaultPoisVisible,
  modulePoisVisible,
  mapInstance,
  hasMapError,
  mapViewport,
}: UseMapPoiDataOptions) {
  const { t } = useTranslation('mapping')
  const [areDefaultPoisVisible, setAreDefaultPoisVisible] =
    useState(defaultPoisVisible)
  const [areModulePoisVisible, setAreModulePoisVisible] =
    useState(modulePoisVisible)
  const [poiClusterRadius, setPoiClusterRadius] = useState(
    DEFAULT_POI_CLUSTER_RADIUS,
  )

  const defaultPois = useMemo(
    () =>
      BASE_POI_LIST.map((poi) => {
        const title = t(poi.titleKey)
        const PoiContent = poi.infoContent

        return {
          id: poi.id,
          coordinates: poi.coordinates,
          title,
          iconCategory: poi.iconCategory,
          info: <PoiContent />,
        }
      }),
    [t],
  )

  const visiblePois = useMemo(() => {
    const poisById = new globalThis.Map<string, MapPoi>()

    if (areDefaultPoisVisible) {
      defaultPois.forEach((poi) => poisById.set(poi.id, poi))
    }

    if (areModulePoisVisible) {
      modulePois.forEach((poi) => {
        const defaultPoi = poisById.get(poi.id)
        poisById.set(
          poi.id,
          defaultPoi
            ? { ...defaultPoi, ...poi, info: poi.info ?? defaultPoi.info }
            : poi,
        )
      })
    }

    return [...poisById.values()]
  }, [areDefaultPoisVisible, areModulePoisVisible, defaultPois, modulePois])

  const poiGroups = useMemo(() => {
    if (!mapInstance && !hasMapError) return []

    return clusterMapPois(
      visiblePois,
      mapInstance,
      poiClusterRadius,
      mapViewport?.zoom,
    )
  }, [
    hasMapError,
    mapInstance,
    mapViewport?.zoom,
    poiClusterRadius,
    visiblePois,
  ])

  const isPoiDataReady =
    mapInstance !== null && (visiblePois.length === 0 || poiGroups.length > 0)

  const resetPoiSettings = () => {
    setAreDefaultPoisVisible(defaultPoisVisible)
    setAreModulePoisVisible(modulePoisVisible)
    setPoiClusterRadius(DEFAULT_POI_CLUSTER_RADIUS)
  }

  return {
    areDefaultPoisVisible,
    setAreDefaultPoisVisible,
    areModulePoisVisible,
    setAreModulePoisVisible,
    poiClusterRadius,
    setPoiClusterRadius,
    visiblePois,
    poiGroups,
    isPoiDataReady,
    resetPoiSettings,
  }
}
