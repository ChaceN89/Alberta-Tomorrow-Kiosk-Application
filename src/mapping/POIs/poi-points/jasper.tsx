/**
  File: jasper.tsx | Author: Chace Nielson
  Date Created: Nov 7, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Define Jasper and its localized information content.

  Usage:
  - Included in the base POI list.

  Notes:
  - Coordinates use longitude, latitude order.
 */
import { BasePoiInfoContent } from '../poi-components/BasePoiInfoContent'
import type { MapPoiDefinition } from '@/modules/types'

export const jasperPoi = {
  id: 'jasper',
  flyoverPoiFov: 55,
  titleKey: 'view.defaultPois.jasper',
  iconCategory: 'community',
  coordinates: [-118.0814, 52.8737],
  view: {
    center: [-118.0814, 52.8737],
    zoom: 11,
    pitch: 65,
    bearing: -20,
  },
  infoContent: JasperInfoContent,
} as const satisfies MapPoiDefinition

function JasperInfoContent() {
  return (
    <BasePoiInfoContent descriptionKey="view.defaultPoiInfo.jasper.description" />
  )
}
