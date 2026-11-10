/**
  File: BasePOIList.ts | Author: Chace Nielson
  Date Created: Nov 7, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Gather the individual shared base-map POI definitions.

  Usage:
  - Imported by the shared map and camera controls.

  Notes:
  - POI content and presentation are defined with each individual POI.
 */
import type { ParseKeys } from 'i18next'
import type { MapPoiDefinition, MapPoiView } from '@/modules/types'
import { athabascaFallsPoi } from './poi-points/athabascaFalls'
import { banffPoi } from './poi-points/banff'
import { calgaryPoi } from './poi-points/calgary'
import { canmorePoi } from './poi-points/canmore'
import { cypressHillsPoi } from './poi-points/cypressHills'
import { dinosaurProvincialParkPoi } from './poi-points/dinosaurProvincialPark'
import { drumhellerPoi } from './poi-points/drumheller'
import { dunveganPoi } from './poi-points/dunvegan'
import { edmontonPoi } from './poi-points/edmonton'
import { elkIslandPoi } from './poi-points/elkIsland'
import { headSmashedInPoi } from './poi-points/headSmashedIn'
import { jasperPoi } from './poi-points/jasper'
import { lakeLouisePoi } from './poi-points/lakeLouise'
import { lesserSlaveLakePoi } from './poi-points/lesserSlaveLake'
import { oilSandsDiscoveryCentrePoi } from './poi-points/oilSandsDiscoveryCentre'
import { rockyMountainHousePoi } from './poi-points/rockyMountainHouse'
import { watertonLakesPoi } from './poi-points/watertonLakes'
import { woodBuffaloPoi } from './poi-points/woodBuffalo'
import { writingOnStonePoi } from './poi-points/writingOnStone'

export type BasePoiDefinition = Omit<MapPoiDefinition, 'titleKey' | 'view'> & {
  titleKey: ParseKeys<'mapping'>
  view: MapPoiView
}

// Base POI list - all have self contained data
export const BASE_POI_LIST = [
  athabascaFallsPoi,
  banffPoi,
  canmorePoi,
  calgaryPoi,
  cypressHillsPoi,
  dinosaurProvincialParkPoi,
  drumhellerPoi,
  dunveganPoi,
  edmontonPoi,
  elkIslandPoi,
  headSmashedInPoi,
  jasperPoi,
  lakeLouisePoi,
  lesserSlaveLakePoi,
  oilSandsDiscoveryCentrePoi,
  rockyMountainHousePoi,
  watertonLakesPoi,
  woodBuffaloPoi,
  writingOnStonePoi,
] as const satisfies readonly BasePoiDefinition[]

// Base POI ID type and helper functions
export type BasePoiId = (typeof BASE_POI_LIST)[number]['id']

// Check if a given string is a valid base POI ID
export function isBasePoiId(poiId: string): poiId is BasePoiId {
  return BASE_POI_LIST.some(({ id }) => id === poiId)
}

// Get the base POI definition for a given POI ID
export function getBasePoi(poiId: string) {
  const poi = BASE_POI_LIST.find(({ id }) => id === poiId)

  if (!poi) {
    throw new Error(`Unknown base point of interest "${poiId}"`)
  }

  return poi
}
