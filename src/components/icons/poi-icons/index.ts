/**
  File: index.ts | Author: Chace Nielson
  Date Created: Nov 8, 2026
  Date Updated: Nov 8, 2026

  Description:
  - Export reusable POI category icons and their component registry.

  Usage:
  - POI map and selector components render icons by category.

  Notes:
  - Keep category names aligned with POI data and localized labels.
 */
import { CommunityPoiIcon } from './CommunityPoiIcon'
import { HistoricSitePoiIcon } from './HistoricSitePoiIcon'
import { IndigenousHeritagePoiIcon } from './IndigenousHeritagePoiIcon'
import { InterpretiveCentrePoiIcon } from './InterpretiveCentrePoiIcon'
import { NaturalPlacePoiIcon } from './NaturalPlacePoiIcon'
import { ResidentialSchoolPoiIcon } from './ResidentialSchoolPoiIcon'
import type { PoiIconCategory, PoiIconComponent } from './types'

export { CommunityPoiIcon } from './CommunityPoiIcon'
export { HistoricSitePoiIcon } from './HistoricSitePoiIcon'
export { IndigenousHeritagePoiIcon } from './IndigenousHeritagePoiIcon'
export { InterpretiveCentrePoiIcon } from './InterpretiveCentrePoiIcon'
export { NaturalPlacePoiIcon } from './NaturalPlacePoiIcon'
export { ResidentialSchoolPoiIcon } from './ResidentialSchoolPoiIcon'
export type { PoiIconCategory, PoiIconComponent, PoiIconProps } from './types'

export const POI_CATEGORY_ICONS: Record<PoiIconCategory, PoiIconComponent> = {
  community: CommunityPoiIcon,
  naturalPlace: NaturalPlacePoiIcon,
  historicSite: HistoricSitePoiIcon,
  indigenousHeritage: IndigenousHeritagePoiIcon,
  residentialSchool: ResidentialSchoolPoiIcon,
  interpretiveCentre: InterpretiveCentrePoiIcon,
}
