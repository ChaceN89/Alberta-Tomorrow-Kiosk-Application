/**
  File: useJournal.ts | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Define the expedition journal context and consumer hook.

  Usage:
  - Journal internals serve their providers or components; tutorials use their own providers.

  Notes:
  - None.
 */
import { createContext, useContext } from 'react'

type JournalContextValue = {
  isOpen: boolean
  activeModuleId: string | null
  openJournal: (moduleId?: string) => void
  closeJournal: () => void
  // Passing null selects the journal's title page.
  selectExpedition: (moduleId: string | null) => void
}

export const JournalContext = createContext<JournalContextValue | null>(null)

export function useJournal() {
  const context = useContext(JournalContext)

  if (!context) {
    throw new Error('useJournal must be used within a JournalProvider.')
  }

  return context
}
