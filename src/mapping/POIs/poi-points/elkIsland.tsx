/**
  File: elkIsland.tsx | Author: Chace Nielson
  Date Created: Nov 7, 2026
  Date Updated: Nov 8, 2026

  Description:
  - Define Elk Island base POI and its information content.

  Usage:
  - Included in the base POI list.

  Notes:
  - Coordinates use longitude, latitude order.
 */
import { BasePoiInfoContent } from '../poi-components/BasePoiInfoContent'
import type { MapPoiDefinition } from '@/modules/types'

export const elkIslandPoi = {
  id: 'elkIsland',
  titleKey: 'view.defaultPois.elkIsland',
  iconCategory: 'naturalPlace',
  coordinates: [-112.86, 53.6],
  view: {
    center: [-112.86, 53.6],
    zoom: 11,
    pitch: 60,
    bearing: 0,
  },
  infoContent: ElkIslandInfoContent,
} as const satisfies MapPoiDefinition

function ElkIslandInfoContent() {
  return <BasePoiInfoContent />
}
