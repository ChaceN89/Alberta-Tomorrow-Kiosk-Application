/**
  File: useIntroTour.ts | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 23, 2026

  Description:
  - Define the intro tour context and consumer hook.

  Usage:
  - Journal and intro-tour internals serve their providers or components.

  Notes:
  - None.
 */
import { createContext, useContext } from 'react'

type IntroTourContextValue = {
  isActive: boolean
  stepIndex: number
  next: () => void
  // Ends the tour and remembers that it was finished or skipped.
  finish: () => void
  // Clears the saved flag so the tour starts on the next page load.
  resetFlag: () => void
  // Clears the saved flag and starts the tour now on the home page.
  restartTour: () => void
}

export const IntroTourContext = createContext<IntroTourContextValue | null>(
  null,
)

export function useIntroTour() {
  const context = useContext(IntroTourContext)

  if (!context) {
    throw new Error('useIntroTour must be used within an IntroTourProvider.')
  }

  return context
}
