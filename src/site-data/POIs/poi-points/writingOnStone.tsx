/**
  File: writingOnStone.tsx | Author: Chace Nielson
  Date Created: Nov 7, 2026
  Date Updated: Nov 8, 2026

  Description:
  - Define Writing-on-Stone and its information content.

  Usage:
  - Included in the base POI list.

  Notes:
  - Coordinates use longitude, latitude order.
 */
import { BasePoiInfoContent } from '../poi-components/BasePoiInfoContent'
import type { MapPoiDefinition } from '@/modules/types'

export const writingOnStonePoi = {
  id: 'writingOnStone',
  titleKey: 'view.defaultPois.writingOnStone',
  coordinates: [-112.976, 49.078],
  view: {
    center: [-112.976, 49.078],
    zoom: 12,
    pitch: 60,
    bearing: 0,
  },
  infoContent: WritingOnStoneInfoContent,
} as const satisfies MapPoiDefinition

function WritingOnStoneInfoContent() {
  return <BasePoiInfoContent />
}
