/**
  File: useIntroTutorial.ts | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Define the intro tutorial context and consumer hook.

  Usage:
  - Tutorial internals serve their providers or components.

  Notes:
  - None.
 */
import { createContext, useContext } from 'react'

type IntroTutorialContextValue = {
  isActive: boolean
  stepIndex: number
  next: () => void
  // Ends the tutorial and remembers that it was finished or skipped.
  finish: () => void
  // Clears the saved flag so the tutorial starts on the next page load.
  resetFlag: () => void
  // Clears the saved flag and starts the tutorial now on the home page.
  restartTutorial: () => void
}

export const IntroTutorialContext =
  createContext<IntroTutorialContextValue | null>(null)

export function useIntroTutorial() {
  const context = useContext(IntroTutorialContext)

  if (!context) {
    throw new Error(
      'useIntroTutorial must be used within an IntroTutorialProvider.',
    )
  }

  return context
}
