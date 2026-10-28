/**
  File: IntroTourProvider.tsx | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 23, 2026

  Description:
  - Start the intro tour for first-time visitors and control its steps.

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
  hasCompletedIntroTour,
  markIntroTourCompleted,
  resetIntroTour,
} from './introTourStorage'
import { tourSteps } from './steps'
import { IntroTourContext } from './useIntroTour'

// Gives the splash screen time to finish fading before the tour appears. A little delay ensures smooth transition.
const START_DELAY_MS = 350

// props for this component - the children to be wrapped by the provider
type IntroTourProviderProps = {
  children: ReactNode
}

export function IntroTourProvider({ children }: IntroTourProviderProps) {
  // extract the current pathname and navigation functions from the router
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [stepIndex, setStepIndex] = useState<number | null>(null) // step along the intro tour

  // Decided once per page load, so resetting the flag only affects the next load.
  const [isAutoStartPending, setIsAutoStartPending] = useState(
    () => !hasCompletedIntroTour(),
  )

  // determine if the current page is the home page (root path) if not home, the tour should not auto-start
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
      current === null ? null : Math.min(current + 1, tourSteps.length - 1),
    )
  }, [])

  const finish = useCallback(() => {
    markIntroTourCompleted()
    setIsAutoStartPending(false)
    setStepIndex(null)
  }, [])

  const resetFlag = useCallback(() => {
    resetIntroTour()
  }, [])

  const restartTour = useCallback(() => {
    resetIntroTour()
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
      restartTour,
    }),
    [finish, isHome, next, resetFlag, restartTour, stepIndex],
  )

  return (
    <IntroTourContext.Provider value={contextValue}>
      {children}
    </IntroTourContext.Provider>
  )
}
