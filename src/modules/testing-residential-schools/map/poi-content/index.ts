/**
  File: index.ts | Author: Chace Nielson
  Date Created: Nov 6, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Associate each residential-school POI with its information-panel content.

  Usage:
  - Combined with POI data by the residential-schools module definition.

  Notes:
  - The shared mapping feature receives only the completed POI content.
 */
import type { ModuleMapPoiContentProps } from '@/modules/types'
import type { ComponentType } from 'react'
import { LesserSlaveLakePoi } from './LesserSlaveLakePoi'
import { StAlbertYouvillePoi } from './StAlbertYouvillePoi'
import { StMarysBloodPoi } from './StMarysBloodPoi'

export const residentialSchoolPoiContent: Readonly<
  Record<string, ComponentType<ModuleMapPoiContentProps>>
> = {
  'st-marys-blood': StMarysBloodPoi,
  'st-albert-youville': StAlbertYouvillePoi,
  'lesser-slave-lake': LesserSlaveLakePoi,
}
