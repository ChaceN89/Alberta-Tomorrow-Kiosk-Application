/**
 * File: resetSite.ts | Author: Chace Nielson
 * Created: 2026-10-23 | Updated: 2026-10-23
 * Description: Clear every saved browser value this app owns and reload as a first visit.
 * Dependencies: journalStorage and introTourStorage; add new storage clears here.
 */
import { clearJournalStorage } from '../../journal/journalStorage'
import { resetIntroTour } from '../../tour/introTourStorage'

export function resetSite() {
  clearJournalStorage()
  resetIntroTour()
  window.location.assign('/')
}
