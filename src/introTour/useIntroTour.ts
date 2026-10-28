/**
 * File: useIntroTour.ts | Author: Chace Nielson
 * Created: 2026-10-23 | Updated: 2026-10-23
 * Description: Define the intro tour context and consumer hook.
 * Dependencies: React context.
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
