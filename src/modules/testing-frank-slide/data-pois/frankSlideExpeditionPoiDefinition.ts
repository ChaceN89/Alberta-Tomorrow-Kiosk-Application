/**
  File: frankSlideExpeditionPoiDefinition.ts | Author: Chace Nielson
  Date Created: Nov 9, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Define the expedition-only Frank Slide map point.

  Usage:
  - Shared by expedition POIs and the base-map expedition entry location.

  Notes:
  - Coordinates mark slide debris north of Highway 3, not the interpretive centre.
 */
import type { MapPoiDefinition } from '@/modules/types'
import { FrankSlideInfoContent } from './module-pois/FrankSlidePoi'

export const frankSlidePoi = {
  id: 'frankSlide',
  flyoverPoiFov: 50,
  titleKey: 'title',
  titleNamespace: 'frankSlide',
  iconCategory: 'historicSite',
  coordinates: [-114.392, 49.5965],
  view: {
    center: [-114.392, 49.5965],
    zoom: 12,
    pitch: 65,
    bearing: -90,
  },
  infoContent: FrankSlideInfoContent,
} as const satisfies MapPoiDefinition
