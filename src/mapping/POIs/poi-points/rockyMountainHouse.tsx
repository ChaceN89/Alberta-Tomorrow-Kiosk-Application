/**
  File: rockyMountainHouse.tsx | Author: Chace Nielson
  Date Created: Nov 7, 2026
  Date Updated: Nov 8, 2026

  Description:
  - Define Rocky Mountain House and its information content.

  Usage:
  - Included in the base POI list.

  Notes:
  - Coordinates use longitude, latitude order.
 */
import { BasePoiInfoContent } from '../poi-components/BasePoiInfoContent'
import type { MapPoiDefinition } from '@/modules/types'

export const rockyMountainHousePoi = {
  id: 'rockyMountainHouse',
  titleKey: 'view.defaultPois.rockyMountainHouse',
  iconCategory: 'historicSite',
  coordinates: [-114.9458, 52.362],
  view: {
    center: [-114.9458, 52.362],
    zoom: 13,
    pitch: 60,
    bearing: 0,
  },
  infoContent: RockyMountainHouseInfoContent,
} as const satisfies MapPoiDefinition

function RockyMountainHouseInfoContent() {
  return <BasePoiInfoContent />
}
