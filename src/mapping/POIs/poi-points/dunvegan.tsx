/**
  File: dunvegan.tsx | Author: Chace Nielson
  Date Created: Nov 7, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Define the Historic Dunvegan base-map POI and its information content.

  Usage:
  - Included in the base POI list.

  Notes:
  - Coordinates use longitude, latitude order.
 */
import { BasePoiInfoContent } from '../poi-components/BasePoiInfoContent'
import type { MapPoiDefinition } from '@/modules/types'

export const dunveganPoi = {
  id: 'dunvegan',
  flyoverPoiFov: 37,
  titleKey: 'view.defaultPois.dunvegan',
  iconCategory: 'historicSite',
  coordinates: [-118.5969, 55.923],
  view: {
    center: [-118.5969, 55.923],
    zoom: 12,
    pitch: 65,
    bearing: -20,
  },
  infoContent: DunveganInfoContent,
} as const satisfies MapPoiDefinition

function DunveganInfoContent() {
  return <BasePoiInfoContent />
}
