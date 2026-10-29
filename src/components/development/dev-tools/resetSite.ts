/**
  File: resetSite.ts | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Clear every saved browser value this app owns and reload as a first visit.

  Usage:
  - Shared and app-state UI is imported by app or feature flows.

  Notes:
  - None.
 */
import { clearExpeditionProgressStorage } from '@/save-data/expeditionProgressStorage'
import { resetIntroTutorial } from '@/save-data/introTutorialStorage'
import { resetMediaPlayerTutorial } from '@/save-data/mediaPlayerTutorialStorage'

export function resetSiteTutorialFlags() {
  resetIntroTutorial()
  resetMediaPlayerTutorial()
}

export function resetSite() {
  clearExpeditionProgressStorage()
  resetSiteTutorialFlags()
  window.location.assign('/')
}
