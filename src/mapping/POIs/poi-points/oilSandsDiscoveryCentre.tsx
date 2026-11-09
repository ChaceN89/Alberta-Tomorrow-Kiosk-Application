/**
  File: oilSandsDiscoveryCentre.tsx | Author: Chace Nielson
  Date Created: Nov 7, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Define the Oil Sands Discovery Centre and its information content.

  Usage:
  - Included in the base POI list.

  Notes:
  - The marker is near the Discovery Centre in Fort McMurray.
 */
import { BasePoiInfoContent } from '../poi-components/BasePoiInfoContent'
import type { MapPoiDefinition } from '@/modules/types'

export const oilSandsDiscoveryCentrePoi = {
  id: 'oilSandsDiscoveryCentre',
  flyoverPoiFov: 37,
  titleKey: 'view.defaultPois.oilSandsDiscoveryCentre',
  iconCategory: 'interpretiveCentre',
  coordinates: [-111.346, 56.6711],
  view: {
    center: [-111.346, 56.6711],
    zoom: 12,
    pitch: 60,
    bearing: 0,
  },
  infoContent: OilSandsDiscoveryCentreInfoContent,
} as const satisfies MapPoiDefinition

function OilSandsDiscoveryCentreInfoContent() {
  return <BasePoiInfoContent />
}
