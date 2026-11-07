/**
  File: moduleSettings.ts | Author: Chace Nielson
  Date Created: Nov 6, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Define the Frank Slide module metadata and launch settings.

  Usage:
  - Combined with module content in the module definition.

  Notes:
  - This is a map-first test module with an activity-page quiz.
 */
import type { ModuleSettings } from '@/modules/types'
import { FrankSlideModuleIcon } from '@/components/icons/module-icons'
import frankSlideJournalImage from '@/mapping/assets/frank-slide/frank-slide-mountain-archive.png'

export const frankSlideSettings: ModuleSettings = {
  icon: FrankSlideModuleIcon,
  translationNamespace: 'frankSlide',
  titleKey: 'title',
  descriptionKey: 'description',
  estimatedMinutes: 5,
  startDestination: 'activity',
  journalImage: frankSlideJournalImage,
}
