/**
  File: index.ts | Author: Chace Nielson
  Date Created: Nov 6, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Associate shared base-map POIs with their information-panel components.

  Usage:
  - Used by AlbertaMap to render authored base POI details.

  Notes:
  - POIs without an entry use the shared generic information panel.
 */
import { FrankSlidePoiInfo } from './FrankSlidePoiInfo'
import type { DefaultPoiId } from '../map-settings/defaultPOISettings'

export const defaultPoiContent: Partial<
  Record<DefaultPoiId, typeof FrankSlidePoiInfo>
> = {
  frankSlide: FrankSlidePoiInfo,
}
