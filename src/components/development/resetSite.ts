/**
  File: resetSite.ts | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Clear every saved browser value this app owns and reload as a first visit.

  Usage:
  - Shared and app-state UI is imported by app or feature flows.

  Notes:
  - None.
 */
import { clearJournalStorage } from '../../journal/journalStorage'
import { resetIntroTutorial } from '../../tutorials/intro-tutorial/introTutorialStorage'
import { resetMediaPlayerTutorial } from '../../tutorials/media-player-tutorial/mediaPlayerTutorialStorage'

export function resetSiteTutorialFlags() {
  resetIntroTutorial()
  resetMediaPlayerTutorial()
}

export function resetSite() {
  clearJournalStorage()
  resetSiteTutorialFlags()
  window.location.assign('/')
}
