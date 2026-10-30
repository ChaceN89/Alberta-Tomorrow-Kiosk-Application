/**
  File: MapControlsContext.ts | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Share map view state and actions with the explore-page controls.

  Usage:
  - Provided by AlbertaMap and consumed by map control components.

  Notes:
  - The map remains the owner of all map behavior.
 */
import { createContext, useContext } from 'react'
import type { BasemapStyleId } from '../map-settings/baseMapSettings'
import type { DefaultPoiId } from '../map-settings/defaultPOISettings'

export type MapControlsProps = {
  hasMapError: boolean
  isMapReady: boolean
  isStyleLoading: boolean
  isTerrainEnabled: boolean
  isTerrainTransitioning: boolean
  terrainExaggeration: number
  basemapStyleId: BasemapStyleId
  isHillshadeEnabled: boolean
  isSatelliteEnabled: boolean
  isBasemapPlacesEnabled: boolean
  isAlbertaBoundaryEnabled: boolean
  defaultPoisVisible?: boolean
  modulePoisVisible?: boolean
  hasModulePois?: boolean
  cameraPitch: number
  cameraZoom: number
  onTerrainExaggerationChange: (exaggeration: number) => void
  onBasemapStyleChange: (styleId: string) => void
  onHillshadeChange: (enabled: boolean) => void
  onSatelliteChange: (enabled: boolean) => void
  onBasemapPlacesChange: (enabled: boolean) => void
  onAlbertaBoundaryChange: (enabled: boolean) => void
  onDefaultPoisChange?: (enabled: boolean) => void
  onModulePoisChange?: (enabled: boolean) => void
  onCameraPitchChange: (pitch: number) => void
  onCameraZoomChange: (zoom: number) => void
  onToggleTerrain: () => void
  onNavigateToPoi: (poiId: DefaultPoiId) => void
}

export const MapControlsContext = createContext<MapControlsProps | null>(null)

export function useMapControls() {
  const controls = useContext(MapControlsContext)
  if (!controls) {
    throw new Error('Map controls must be rendered inside an AlbertaMap.')
  }

  return controls
}
