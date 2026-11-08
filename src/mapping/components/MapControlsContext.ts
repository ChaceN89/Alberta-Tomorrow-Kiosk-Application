/**
  File: MapControlsContext.ts | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Nov 7, 2026

  Description:
  - Share map view state and actions with the explore-page controls.

  Usage:
  - Provided by AlbertaMap and consumed by map control components.

  Notes:
  - The map remains the owner of all map behavior.
 */
import { createContext, useContext } from 'react'
import type { BasemapStyleId } from '../map-settings/baseMapSettings'
import type { BasePoiId } from '@/site-data/POIs/BasePOIList'

export type MapControlsProps = {
  hasMapError: boolean
  isMapReady: boolean
  isStyleLoading: boolean
  isTerrainEnabled: boolean
  isTerrainTransitioning: boolean
  isFlyoverEnabled: boolean
  isFlyoverTransitioning: boolean
  terrainExaggeration: number
  basemapStyleId: BasemapStyleId
  isHillshadeEnabled: boolean
  isSatelliteEnabled: boolean
  isAlbertaBoundaryEnabled: boolean
  onResetMapView: () => void
  defaultPoisVisible?: boolean
  modulePoisVisible?: boolean
  hasModulePois?: boolean
  poiClusterRadius: number
  onTerrainExaggerationChange: (exaggeration: number) => void
  onBasemapStyleChange: (styleId: string) => void
  onHillshadeChange: (enabled: boolean) => void
  onSatelliteChange: (enabled: boolean) => void
  onAlbertaBoundaryChange: (enabled: boolean) => void
  onDefaultPoisChange?: (enabled: boolean) => void
  onModulePoisChange?: (enabled: boolean) => void
  onPoiClusterRadiusChange: (radius: number) => void
  onToggleTerrain: () => void
  onToggleFlyover: () => void
  onStartFlyover: (pauseAfterEntry: boolean) => void
  onSetFlyoverPaused: (isPaused: boolean) => void
  onFlyoverTravelTo: (coordinates: [number, number]) => void
  onNavigateToPoi: (poiId: BasePoiId, offset?: [number, number]) => void
}

export type MapControllerControlsProps = Omit<
  MapControlsProps,
  'poiClusterRadius' | 'onPoiClusterRadiusChange' | 'onResetMapView'
>

export const MapControlsContext = createContext<MapControlsProps | null>(null)

export function useMapControls() {
  const controls = useContext(MapControlsContext)
  if (!controls) {
    throw new Error('Map controls must be rendered inside an AlbertaMap.')
  }

  return controls
}
