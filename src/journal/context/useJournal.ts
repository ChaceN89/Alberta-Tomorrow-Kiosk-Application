/**
  File: useJournal.ts | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Define navigation for title, Alberta discovery, and expedition journal pages.

  Usage:
  - Journal internals serve their providers or components; tutorials use their own providers.

  Notes:
  - Throws when consumed outside JournalProvider so missing setup is explicit.
 */
import { createContext, useContext } from 'react'

type JournalContextValue = {
  isOpen: boolean
  activePageId: string | null
  openJournal: (pageId?: string) => void
  closeJournal: () => void
  // Passing null selects the journal's title page.
  selectPage: (pageId: string | null) => void
}

// the context for the expedition journal, providing state and actions to manage the journal's visibility and active module
export const JournalContext = createContext<JournalContextValue | null>(null)

// use this context consumer hook to access the journal state and actions within components
export function useJournal() {
  const context = useContext(JournalContext)

  if (!context) {
    throw new Error('useJournal must be used within a JournalProvider.')
  }

  return context
}
