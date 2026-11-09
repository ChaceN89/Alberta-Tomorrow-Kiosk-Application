/**
  File: lesserSlaveLake.tsx | Author: Chace Nielson
  Date Created: Nov 7, 2026
  Date Updated: Nov 8, 2026

  Description:
  - Define Lesser Slave Lake and its information content.

  Usage:
  - Included in the base POI list.

  Notes:
  - The marker is near Lesser Slave Lake Provincial Park.
 */
import { BasePoiInfoContent } from '../poi-components/BasePoiInfoContent'
import type { MapPoiDefinition } from '@/modules/types'

export const lesserSlaveLakePoi = {
  id: 'lesserSlaveLake',
  titleKey: 'view.defaultPois.lesserSlaveLake',
  iconCategory: 'naturalPlace',
  coordinates: [-114.8128, 55.4434],
  view: {
    center: [-114.8128, 55.4434],
    zoom: 10,
    pitch: 55,
    bearing: 0,
  },
  infoContent: LesserSlaveLakeInfoContent,
} as const satisfies MapPoiDefinition

function LesserSlaveLakeInfoContent() {
  return <BasePoiInfoContent />
}
