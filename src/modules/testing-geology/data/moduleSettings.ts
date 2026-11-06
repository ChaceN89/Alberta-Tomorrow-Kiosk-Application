/**
  File: moduleSettings.ts | Author: Chace Nielson
  Date Created: Nov 6, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Define the geology module's metadata and launch settings.

  Usage:
  - Combined with module content in the module definition.

  Notes:
  - Add settings here when the module gains additional configurable behavior.
 */
import type { ModuleSettings } from '@/modules/types'

export const geologySettings: ModuleSettings = {
  translationNamespace: 'geology',
  titleKey: 'title',
  descriptionKey: 'description',
  estimatedMinutes: 4,
  startDestination: 'activity',
  journalDescriptionKey: 'journal.summary',
}
