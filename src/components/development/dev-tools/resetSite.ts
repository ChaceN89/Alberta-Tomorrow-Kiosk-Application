/**
  File: resetSite.ts | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Nov 5, 2026

  Description:
  - Clear tutorial flags, reset expedition progress, and reload as a first visit.

  Usage:
  - Called by the development tools after the user confirms a site reset.

  Notes:
  - Expedition progress is cleared through the provider's configured repository.
 */
import { resetIntroTutorial } from '@/save-data/tutorial-progress/introTutorialStorage'
import { resetMediaPlayerTutorial } from '@/save-data/tutorial-progress/mediaPlayerTutorialStorage'

export function resetSiteTutorialFlags() {
  resetIntroTutorial()
  resetMediaPlayerTutorial()
}

export async function resetSite(resetExpeditionProgress: () => Promise<void>) {
  await resetExpeditionProgress()
  resetSiteTutorialFlags()
  window.location.assign('/')
}
