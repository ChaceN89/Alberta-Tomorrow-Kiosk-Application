/**
  File: drumheller.tsx | Author: Chace Nielson
  Date Created: Nov 7, 2026
  Date Updated: Nov 8, 2026

  Description:
  - Define the Drumheller base-map POI and its information content.

  Usage:
  - Included in the base POI list.

  Notes:
  - Coordinates use longitude, latitude order.
 */
import { BasePoiInfoContent } from '../poi-components/BasePoiInfoContent'
import type { MapPoiDefinition } from '@/modules/types'

export const drumhellerPoi = {
  id: 'drumheller',
  titleKey: 'view.defaultPois.drumheller',
  iconCategory: 'community',
  coordinates: [-112.71, 51.463],
  view: {
    center: [-112.71, 51.463],
    zoom: 12,
    pitch: 65,
    bearing: 0,
  },
  infoContent: DrumhellerInfoContent,
} as const satisfies MapPoiDefinition

function DrumhellerInfoContent() {
  return <BasePoiInfoContent />
}
