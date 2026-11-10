/**
  File: resetSite.ts | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Clear tutorials, expeditions, and Alberta discoveries before a first-visit reload.

  Usage:
  - Called by the development tools after the user confirms a site reset.

  Notes:
  - Expedition progress is cleared through the provider's configured repository.
 */
import { resetIntroTutorial } from '@/save-data/tutorial-progress/introTutorialStorage'
import { resetMediaPlayerTutorial } from '@/save-data/tutorial-progress/mediaPlayerTutorialStorage'
import { resetIntroToMapTutorial } from '@/save-data/tutorial-progress/introToMapTutorialStorage'
import { resetPlaneTutorial } from '@/save-data/tutorial-progress/planeTutorialStorage'

export function resetSiteTutorialFlags() {
  resetIntroTutorial()
  resetMediaPlayerTutorial()
  resetIntroToMapTutorial()
  resetPlaneTutorial()
}

export async function resetSite(
  resetExpeditionProgress: () => Promise<void>,
  resetDiscoveries: () => Promise<boolean>,
) {
  if (!(await resetDiscoveries())) return false
  await resetExpeditionProgress()
  resetSiteTutorialFlags()
  window.location.assign('/')
  return true
}
