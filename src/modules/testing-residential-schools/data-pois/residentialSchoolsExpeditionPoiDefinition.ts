/**
  File: residentialSchoolsExpeditionPoiDefinition.ts | Author: Chace Nielson
  Date Created: Nov 9, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Define the St. Albert-Youville point that locates the expedition entry.

  Usage:
  - Shared by expedition POIs and the base-map expedition entry location.

  Notes:
  - Completion requirements remain in pois.ts.
 */
import type { MapPoiDefinition } from '@/modules/types'
import { StAlbertYouvillePoi } from './module-pois/StAlbertYouvillePoi'

export const residentialSchoolsExpeditionPoi = {
  id: 'st-albert-youville',
  flyoverPoiFov: 37,
  infoContent: StAlbertYouvillePoi,
  coordinates: [-113.625, 53.63],
  titleKey: 'activity.schools.st-albert-youville.name',
  titleNamespace: 'residentialSchool',
  iconCategory: 'residentialSchool',
} as const satisfies MapPoiDefinition
