/**
  File: dinosaurProvincialPark.tsx | Author: Chace Nielson
  Date Created: Nov 7, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Define Dinosaur Provincial Park and its image information content.

  Usage:
  - Included in the base POI list.

  Notes:
  - Coordinates use longitude, latitude order.
 */
import dinosaurBadlands from '@/mapping/assets/dinosaur-badlands.jpg'
import { BasePoiInfoContent } from '../poi-components/BasePoiInfoContent'
import type { MapPoiDefinition } from '@/modules/types'

export const dinosaurProvincialParkPoi = {
  id: 'dinosaurProvincialPark',
  flyoverPoiFov: 60,
  titleKey: 'view.defaultPois.dinosaurProvincialPark',
  iconCategory: 'naturalPlace',
  coordinates: [-111.528, 50.7566],
  view: {
    center: [-111.528, 50.7566],
    zoom: 12,
    pitch: 65,
    bearing: 0,
  },
  infoContent: DinosaurProvincialParkInfoContent,
} as const satisfies MapPoiDefinition

function DinosaurProvincialParkInfoContent() {
  return (
    <BasePoiInfoContent
      descriptionKey="view.defaultPoiInfo.dinosaurProvincialPark.description"
      image={{
        src: dinosaurBadlands,
        altKey: 'view.defaultPoiInfo.dinosaurProvincialPark.imageAlt',
      }}
    />
  )
}
