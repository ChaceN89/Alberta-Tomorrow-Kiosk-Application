/**
  File: athabascaFalls.tsx | Author: Chace Nielson
  Date Created: Nov 7, 2026
  Date Updated: Nov 7, 2026

  Description:
  - Define the Athabasca Falls base-map POI and its information content.

  Usage:
  - Included in the base POI list.

  Notes:
  - Coordinates use longitude, latitude order.
 */
import { BasePoiInfoContent } from '../poi-components/BasePoiInfoContent'
import type { MapPoiDefinition } from '@/modules/types'

export const athabascaFallsPoi = {
  id: 'athabascaFalls',
  titleKey: 'view.defaultPois.athabascaFalls',
  coordinates: [-117.884, 52.6648],
  view: {
    center: [-117.884, 52.6648],
    zoom: 13,
    pitch: 65,
    bearing: 0,
  },
  infoContent: AthabascaFallsInfoContent,
} as const satisfies MapPoiDefinition

function AthabascaFallsInfoContent() {
  return <BasePoiInfoContent />
}
