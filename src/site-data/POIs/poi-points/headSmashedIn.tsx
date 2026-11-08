/**
  File: headSmashedIn.tsx | Author: Chace Nielson
  Date Created: Nov 7, 2026
  Date Updated: Nov 8, 2026

  Description:
  - Define the Head-Smashed-In Buffalo Jump base POI and its information content.

  Usage:
  - Included in the base POI list.

  Notes:
  - The marker is near the interpretive centre.
 */
import { BasePoiInfoContent } from '../poi-components/BasePoiInfoContent'
import type { MapPoiDefinition } from '@/modules/types'

export const headSmashedInPoi = {
  id: 'headSmashedIn',
  titleKey: 'view.defaultPois.headSmashedIn',
  coordinates: [-113.653, 49.7075],
  view: {
    center: [-113.653, 49.7075],
    zoom: 13,
    pitch: 65,
    bearing: -90,
  },
  infoContent: HeadSmashedInInfoContent,
} as const satisfies MapPoiDefinition

function HeadSmashedInInfoContent() {
  return <BasePoiInfoContent />
}
