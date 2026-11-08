/**
  File: canmore.tsx | Author: Chace Nielson
  Date Created: Nov 7, 2026
  Date Updated: Nov 8, 2026

  Description:
  - Define the Canmore base-map POI and its information content.

  Usage:
  - Included in the base POI list.

  Notes:
  - Coordinates use longitude, latitude order.
 */
import { BasePoiInfoContent } from '../poi-components/BasePoiInfoContent'
import type { MapPoiDefinition } from '@/modules/types'

export const canmorePoi = {
  id: 'canmore',
  titleKey: 'view.defaultPois.canmore',
  coordinates: [-115.359, 51.089],
  view: {
    center: [-115.359, 51.089],
    zoom: 12,
    pitch: 65,
    bearing: -30,
  },
  infoContent: CanmoreInfoContent,
} as const satisfies MapPoiDefinition

function CanmoreInfoContent() {
  return <BasePoiInfoContent />
}
