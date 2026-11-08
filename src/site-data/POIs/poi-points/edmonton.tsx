/**
  File: edmonton.tsx | Author: Chace Nielson
  Date Created: Nov 7, 2026
  Date Updated: Nov 8, 2026

  Description:
  - Define Edmonton and its information content.

  Usage:
  - Included in the base POI list.

  Notes:
  - Coordinates use longitude, latitude order.
 */
import { BasePoiInfoContent } from '../poi-components/BasePoiInfoContent'
import type { MapPoiDefinition } from '@/modules/types'

export const edmontonPoi = {
  id: 'edmonton',
  titleKey: 'view.defaultPois.edmonton',
  coordinates: [-113.4938, 53.5461],
  view: {
    center: [-113.4938, 53.5461],
    zoom: 11,
    pitch: 50,
    bearing: 0,
  },
  infoContent: EdmontonInfoContent,
} as const satisfies MapPoiDefinition

function EdmontonInfoContent() {
  return (
    <BasePoiInfoContent descriptionKey="view.defaultPoiInfo.edmonton.description" />
  )
}
