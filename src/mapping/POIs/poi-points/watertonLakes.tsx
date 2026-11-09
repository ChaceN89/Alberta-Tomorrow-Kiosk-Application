/**
  File: watertonLakes.tsx | Author: Chace Nielson
  Date Created: Nov 7, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Define Waterton Lakes and its image information content.

  Usage:
  - Included in the base POI list.

  Notes:
  - Coordinates use longitude, latitude order.
 */
import watertonLakes from '@/mapping/assets/waterton-lakes.jpg'
import { BasePoiInfoContent } from '../poi-components/BasePoiInfoContent'
import type { MapPoiDefinition } from '@/modules/types'

export const watertonLakesPoi = {
  id: 'watertonLakes',
  flyoverPoiFov: 70,
  titleKey: 'view.defaultPois.watertonLakes',
  iconCategory: 'naturalPlace',
  coordinates: [-113.9179, 49.052],
  view: {
    center: [-113.9179, 49.052],
    zoom: 12,
    pitch: 65,
    bearing: -20,
  },
  infoContent: WatertonLakesInfoContent,
} as const satisfies MapPoiDefinition

function WatertonLakesInfoContent() {
  return (
    <BasePoiInfoContent
      descriptionKey="view.defaultPoiInfo.watertonLakes.description"
      image={{
        src: watertonLakes,
        altKey: 'view.defaultPoiInfo.watertonLakes.imageAlt',
      }}
    />
  )
}
