/**
  File: lakeLouise.tsx | Author: Chace Nielson
  Date Created: Nov 7, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Define Lake Louise and its information content.

  Usage:
  - Included in the base POI list.

  Notes:
  - Coordinates use longitude, latitude order.
 */
import { BasePoiInfoContent } from '../poi-components/BasePoiInfoContent'
import type { MapPoiDefinition } from '@/modules/types'

export const lakeLouisePoi = {
  id: 'lakeLouise',
  flyoverPoiFov: 50,
  titleKey: 'view.defaultPois.lakeLouise',
  iconCategory: 'naturalPlace',
  coordinates: [-116.1773, 51.4254],
  view: {
    center: [-116.1773, 51.4254],
    zoom: 12,
    pitch: 65,
    bearing: -20,
  },
  infoContent: LakeLouiseInfoContent,
} as const satisfies MapPoiDefinition

function LakeLouiseInfoContent() {
  return <BasePoiInfoContent />
}
