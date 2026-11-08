/**
  File: module.ts | Author: Chace Nielson
  Date Created: Nov 6, 2026
  Date Updated: Nov 7, 2026

  Description:
  - Assemble the residential-schools module's map, journal, and loading features.

  Usage:
  - Imported by the shared module registry.

  Notes:
  - The map POI content is owned by this module and supplied to the shared map.
 */
import type { ModuleDefinition } from '@/modules/types'
import { residentialSchoolCheckpoints } from './journal/checkpoints'
import { residentialSchoolsSettings } from './data/moduleSettings'
import { residentialSchoolJournalEntries } from './journal/entries'
import { residentialSchoolMapSettings } from './data/map-settings'
import { residentialSchoolMapPois } from './data-pois/pois'
import { preloadResidentialSchool } from './loading/preload'

export const residentialSchoolsModule: ModuleDefinition = {
  ...residentialSchoolsSettings,
  checkpoints: residentialSchoolCheckpoints,
  map: {
    settings: residentialSchoolMapSettings,
    pois: residentialSchoolMapPois,
  },
  journalEntries: residentialSchoolJournalEntries,
  preload: preloadResidentialSchool,
}
