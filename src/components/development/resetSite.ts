/**
  File: resetSite.ts | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 23, 2026

  Description:
  - Clear every saved browser value this app owns and reload as a first visit.

  Usage:
  - Shared and app-state UI is imported by app or feature flows.

  Notes:
  - None.
 */
import { clearJournalStorage } from '../../journal/journalStorage'
import { resetIntroTour } from '../../site-tours/intro-tour/introTourStorage'
import { resetMediaPlayerTour } from '../../site-tours/media-player-tour/mediaPlayerTourStorage'

export function resetSite() {
  clearJournalStorage()
  resetIntroTour()
  resetMediaPlayerTour()
  window.location.assign('/')
}
