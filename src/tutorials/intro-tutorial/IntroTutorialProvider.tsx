/**
  File: IntroTutorialProvider.tsx | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Start the intro tutorial for first-time visitors and control its steps.

  Usage:
  - Providers supply or wrap state.

  Notes:
  - None.
 */
import { useLocation, useNavigate } from 'react-router-dom'
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  hasCompletedIntroTutorial,
  markIntroTutorialCompleted,
  resetIntroTutorial,
} from '@/save-data/introTutorialStorage'
import { introTutorialSteps } from './steps'
import { IntroTutorialContext } from './useIntroTutorial'

// Gives the splash screen time to finish fading before the tutorial appears. A little delay ensures smooth transition.
const START_DELAY_MS = 350

// props for this component - the children to be wrapped by the provider
type IntroTutorialProviderProps = {
  children: ReactNode
}

export function IntroTutorialProvider({
  children,
}: IntroTutorialProviderProps) {
  // extract the current pathname and navigation functions from the router
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [stepIndex, setStepIndex] = useState<number | null>(null) // step along the intro tutorial

  // Decided once per page load, so resetting the flag only affects the next load.
  const [isAutoStartPending, setIsAutoStartPending] = useState(
    () => !hasCompletedIntroTutorial(),
  )

  // Determine if the current page is the home page; tutorials only auto-start there.
  const isHome = pathname === '/'

  useEffect(() => {
    if (!isAutoStartPending || !isHome) return

    const timer = window.setTimeout(() => {
      setIsAutoStartPending(false)
      setStepIndex(0)
    }, START_DELAY_MS)

    return () => window.clearTimeout(timer)
  }, [isAutoStartPending, isHome])

  const next = useCallback(() => {
    setStepIndex((current) =>
      current === null
        ? null
        : Math.min(current + 1, introTutorialSteps.length - 1),
    )
  }, [])

  const finish = useCallback(() => {
    markIntroTutorialCompleted()
    setIsAutoStartPending(false)
    setStepIndex(null)
  }, [])

  const resetFlag = useCallback(() => {
    resetIntroTutorial()
  }, [])

  const restartTutorial = useCallback(() => {
    resetIntroTutorial()
    setIsAutoStartPending(false)
    navigate('/')
    setStepIndex(0)
  }, [navigate])

  const contextValue = useMemo(
    () => ({
      isActive: stepIndex !== null && isHome,
      stepIndex: stepIndex ?? 0,
      next,
      finish,
      resetFlag,
      restartTutorial,
    }),
    [finish, isHome, next, resetFlag, restartTutorial, stepIndex],
  )

  return (
    <IntroTutorialContext.Provider value={contextValue}>
      {children}
    </IntroTutorialContext.Provider>
  )
}
