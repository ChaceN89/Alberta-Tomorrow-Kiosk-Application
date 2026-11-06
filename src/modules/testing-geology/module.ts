/**
  File: module.ts | Author: Chace Nielson
  Date Created: Nov 6, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Assemble the geology module's metadata, activity, and journal features.

  Usage:
  - Imported by the shared module registry.

  Notes:
  - The activity page and journal action remain lazy-loaded.
 */
import { lazy } from 'react'
import type { ModuleDefinition } from '@/modules/types'
import { geologyCheckpoints } from './journal/checkpoints'
import { geologySettings } from './data/moduleSettings'
import { geologyJournalEntries } from './journal/entries'

const loadActivityPage = () => import('./activity-page/ActivityPage')

export const geologyModule: ModuleDefinition = {
  ...geologySettings,
  checkpoints: geologyCheckpoints,
  activityPage: lazy(loadActivityPage),
  loadActivityPage,
  journalEntries: geologyJournalEntries,
}
