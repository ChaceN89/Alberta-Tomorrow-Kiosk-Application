/**
  File: cypressHills.tsx | Author: Chace Nielson
  Date Created: Nov 7, 2026
  Date Updated: Nov 8, 2026

  Description:
  - Define the Cypress Hills base-map POI and its information content.

  Usage:
  - Included in the base POI list.

  Notes:
  - The marker is near Elkwater, the Alberta-side visitor hub.
 */
import { BasePoiInfoContent } from '../poi-components/BasePoiInfoContent'
import type { MapPoiDefinition } from '@/modules/types'

export const cypressHillsPoi = {
  id: 'cypressHills',
  titleKey: 'view.defaultPois.cypressHills',
  iconCategory: 'naturalPlace',
  coordinates: [-110.2823, 49.6614],
  view: {
    center: [-110.2823, 49.6614],
    zoom: 11,
    pitch: 60,
    bearing: 0,
  },
  infoContent: CypressHillsInfoContent,
} as const satisfies MapPoiDefinition

function CypressHillsInfoContent() {
  return <BasePoiInfoContent />
}
