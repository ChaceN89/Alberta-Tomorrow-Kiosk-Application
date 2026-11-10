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
import { useAlbertaDiscoveries } from '@/save-data/alberta-discoveries/useAlbertaDiscoveries'
import type { BasePoiDefinition } from '@/mapping/POIs/BasePOIList'
import type { MapPoi } from '../components/MapPoiMarker'
import { clusterMapPois } from '../map-functions/clusterMapPois'
import { DEFAULT_POI_CLUSTER_RADIUS } from '../map-settings/poiClusterSettings'
import type { MapViewport } from './useMapViewport'
import { visibleModules } from '@/modules/registry'
import { useExpeditionProgress } from '@/save-data/expedition-progress'
import { ModuleEntryPoiContent } from '../components/ModuleEntryPoiContent'

type UseMapPoiDataOptions = {
  modulePois: readonly MapPoi[]
  defaultPoisVisible: boolean
  modulePoisVisible: boolean
  isBaseMap: boolean
  isFlyoverActive: boolean
  mapInstance: MapLibreMap | null
  hasMapError: boolean
  mapViewport: MapViewport | null
}

export function useMapPoiData({
  modulePois,
  defaultPoisVisible,
  modulePoisVisible,
  isBaseMap,
  isFlyoverActive,
  mapInstance,
  hasMapError,
  mapViewport,
}: UseMapPoiDataOptions) {
  const { t, i18n } = useTranslation('mapping')
  const { discoveries } = useAlbertaDiscoveries()
  const { getExpeditionProgress } = useExpeditionProgress()
  const [areModuleEntriesVisible, setAreModuleEntriesVisible] =
    useState(isBaseMap)
  const [areDefaultPoisVisible, setAreDefaultPoisVisible] =
    useState(defaultPoisVisible)
  const [areModulePoisVisible, setAreModulePoisVisible] =
    useState(modulePoisVisible)
  const [poiClusterRadius, setPoiClusterRadius] = useState(
    DEFAULT_POI_CLUSTER_RADIUS,
  )

  const defaultPois = useMemo(
    () =>
      BASE_POI_LIST.map((poi: BasePoiDefinition) => {
        const title = t(poi.titleKey)
        const PoiContent = poi.infoContent

        return {
          id: poi.id,
          isComplete: Object.hasOwn(discoveries, poi.id),
          coordinates: poi.coordinates,
          title,
          iconCategory: poi.iconCategory,
          flyoverRadiusMultiplier: poi.flyoverRadiusMultiplier,
          flyoverCylinderHeightMultiplier: poi.flyoverCylinderHeightMultiplier,
          flyoverPoiFov: poi.flyoverPoiFov,
          info: <PoiContent />,
        }
      }),
    [discoveries, t],
  )

  const selectablePois = useMemo(() => {
    const poisById = new globalThis.Map<string, MapPoi>()

    if (areDefaultPoisVisible) {
      defaultPois.forEach((poi) => poisById.set(poi.id, poi))
    }

    if (areModulePoisVisible) {
      modulePois.forEach((poi) => {
        const defaultPoi = poisById.get(poi.id)
        poisById.set(poi.id, {
          ...(defaultPoi
            ? { ...defaultPoi, ...poi, info: poi.info ?? defaultPoi.info }
            : poi),
          isModulePoi: true,
        })
      })
    }

    if (areModuleEntriesVisible) {
      visibleModules.forEach((module) => {
        const entry = module.map?.settings.baseMapEntry
        if (!entry) return
        const progress = getExpeditionProgress(module)
        const title = t('moduleEntry.title', {
          name: i18n.t(module.titleKey, {
            ns: module.translationNamespace,
          }),
        })
        const isUnstarted = progress.status === 'notStarted'
        const id = `module-entry:${module.id}`
        poisById.set(id, {
          ...entry,
          id,
          title: isUnstarted ? t('moduleEntry.unknown') : title,
          concealedTitle: isUnstarted ? title : undefined,
          iconCategory: 'interpretiveCentre',
          icon: module.icon,
          isModuleEntry: true,
          isComplete: progress.status === 'complete',
          info: <ModuleEntryPoiContent module={module} />,
        })
      })
    }

    return [...poisById.values()]
  }, [
    areDefaultPoisVisible,
    areModulePoisVisible,
    areModuleEntriesVisible,
    defaultPois,
    modulePois,
    getExpeditionProgress,
    i18n,
    t,
  ])

  const visiblePois = useMemo(
    () => selectablePois.filter((poi) => !poi.isModuleEntry || isFlyoverActive),
    [selectablePois, isFlyoverActive],
  )

  const poiGroups = useMemo(() => {
    if (!mapInstance && !hasMapError) return []

    return [
      ...clusterMapPois(
        visiblePois.filter((poi) => !poi.isModuleEntry),
        mapInstance,
        poiClusterRadius,
        mapViewport?.zoom,
      ),
      ...clusterMapPois(
        visiblePois.filter((poi) => poi.isModuleEntry),
        mapInstance,
        poiClusterRadius,
        mapViewport?.zoom,
      ),
    ]
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
    setAreModuleEntriesVisible(isBaseMap)
    setPoiClusterRadius(DEFAULT_POI_CLUSTER_RADIUS)
  }

  return {
    areModuleEntriesVisible,
    setAreModuleEntriesVisible,
    areDefaultPoisVisible,
    setAreDefaultPoisVisible,
    areModulePoisVisible,
    setAreModulePoisVisible,
    poiClusterRadius,
    setPoiClusterRadius,
    visiblePois,
    selectablePois,
    poiGroups,
    isPoiDataReady,
    resetPoiSettings,
  }
}
