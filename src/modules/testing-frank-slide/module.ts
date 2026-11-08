/**
  File: module.ts | Author: Chace Nielson
  Date Created: Nov 6, 2026
  Date Updated: Nov 7, 2026

  Description:
  - Assemble Frank Slide map, activity, journal, and loading features.

  Usage:
  - Imported by the shared module registry.

  Notes:
  - Frank Slide reuses its base-map POI; Turtle Mountain and checkpoints are module-owned.
 */
import { lazy } from 'react'
import type { ModuleDefinition, ModulePreloadContext } from '@/modules/types'
import { frankSlideCheckpoints } from './journal/checkpoints'
import { frankSlideSettings } from './data/moduleSettings'
import { frankSlideJournalEntries } from './journal/entries'
import { frankSlideMapSettings } from './data/map-settings'
import { frankSlideMapPois } from './data-pois/pois'

const loadActivityPage = () => import('./activity-page/ActivityPage')
const preload = (context: ModulePreloadContext) =>
  import('./loading/preload').then(({ preloadFrankSlide }) =>
    preloadFrankSlide(context),
  )

export const frankSlideModule: ModuleDefinition = {
  ...frankSlideSettings,
  checkpoints: frankSlideCheckpoints,
  map: {
    settings: frankSlideMapSettings,
    pois: frankSlideMapPois,
  },
  activityPage: lazy(loadActivityPage),
  loadActivityPage,
  journalEntries: frankSlideJournalEntries,
  preload,
}
