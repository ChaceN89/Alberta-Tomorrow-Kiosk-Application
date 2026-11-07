/**
  File: module.ts | Author: Chace Nielson
  Date Created: Nov 6, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Assemble the wildlife module's metadata, activity, journal, and loading features.

  Usage:
  - Imported by the shared module registry.

  Notes:
  - The activity page and journal action remain lazy-loaded.
 */
import { lazy } from 'react'
import type { ModuleDefinition, ModulePreloadContext } from '@/modules/types'
import { foxesOfAlbertaCheckpoints } from './journal/checkpoints'
import { foxesOfAlbertaSettings } from './data/moduleSettings'
import { foxesJournalEntries } from './journal/entries'

const loadActivityPage = () => import('./activity-page/ActivityPage')
const preload = (context: ModulePreloadContext) =>
  import('./loading/preload').then(({ preloadFoxesOfAlberta }) =>
    preloadFoxesOfAlberta(context),
  )

export const foxesOfAlbertaModule: ModuleDefinition = {
  ...foxesOfAlbertaSettings,
  checkpoints: foxesOfAlbertaCheckpoints,
  activityPage: lazy(loadActivityPage),
  loadActivityPage,
  journalEntries: foxesJournalEntries,
  preload,
}
