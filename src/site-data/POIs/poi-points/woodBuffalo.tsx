/**
  File: woodBuffalo.tsx | Author: Chace Nielson
  Date Created: Nov 7, 2026
  Date Updated: Nov 8, 2026

  Description:
  - Define Wood Buffalo and its information content.

  Usage:
  - Included in the base POI list.

  Notes:
  - Coordinates use longitude, latitude order.
 */
import { BasePoiInfoContent } from '../poi-components/BasePoiInfoContent'
import type { MapPoiDefinition } from '@/modules/types'

export const woodBuffaloPoi = {
  id: 'woodBuffalo',
  titleKey: 'view.defaultPois.woodBuffalo',
  iconCategory: 'naturalPlace',
  coordinates: [-111.17, 58.72],
  view: {
    center: [-111.17, 58.72],
    zoom: 10,
    pitch: 55,
    bearing: 0,
  },
  infoContent: WoodBuffaloInfoContent,
} as const satisfies MapPoiDefinition

function WoodBuffaloInfoContent() {
  return <BasePoiInfoContent />
}
