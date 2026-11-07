/**
  File: moduleSettings.ts | Author: Chace Nielson
  Date Created: Nov 6, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Define the wildlife module's metadata and launch settings.

  Usage:
  - Combined with module content in the module definition.

  Notes:
  - Add settings here when the module gains additional configurable behavior.
 */
import type { ModuleSettings } from '@/modules/types'
import { FoxesModuleIcon } from '@/components/icons/module-icons'
import foxesJournalImage from '../assets/fox-family.png'

export const foxesOfAlbertaSettings: ModuleSettings = {
  icon: FoxesModuleIcon,
  translationNamespace: 'wildlifeFinder',
  titleKey: 'title',
  descriptionKey: 'description',
  estimatedMinutes: 5,
  startDestination: 'activity',
  journalImage: foxesJournalImage,
}
