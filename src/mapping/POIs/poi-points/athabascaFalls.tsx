/**
  File: athabascaFalls.tsx | Author: Chace Nielson
  Date Created: Nov 7, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Define the Athabasca Falls base-map POI and its information content.

  Usage:
  - Included in the base POI list.

  Notes:
  - Coordinates use longitude, latitude order.
 */
import { BasePoiInfoContent } from '../poi-components/BasePoiInfoContent'
import type { MapPoiDefinition } from '@/modules/types'
import athabascaFallsImage from '@/mapping/assets/athabasca-falls.png'

export const athabascaFallsPoi = {
  id: 'athabascaFalls',
  flyoverPoiFov: 24,
  titleKey: 'view.defaultPois.athabascaFalls',
  iconCategory: 'naturalPlace',
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
  return (
    <BasePoiInfoContent
      descriptionKey="view.defaultPoiInfo.athabascaFalls.description"
      image={{
        src: athabascaFallsImage,
        altKey: 'view.defaultPoiInfo.athabascaFalls.imageAlt',
      }}
    />
  )
}
