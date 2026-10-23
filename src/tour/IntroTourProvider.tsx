/**
 * File: IntroTourProvider.tsx | Author: Chace Nielson
 * Created: 2026-10-23 | Updated: 2026-10-23
 * Description: Start the intro tour for first-time visitors and control its steps.
 * Dependencies: React Router, introTourStorage, tour steps.
 */
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  hasCompletedIntroTour,
  markIntroTourCompleted,
  resetIntroTour,
} from './introTourStorage'
import { tourSteps } from './steps'
import { IntroTourContext } from './useIntroTour'

// Gives the splash screen time to finish fading before the tour appears.
const START_DELAY_MS = 350

type IntroTourProviderProps = {
  children: ReactNode
}

export function IntroTourProvider({ children }: IntroTourProviderProps) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [stepIndex, setStepIndex] = useState<number | null>(null)
  // Decided once per page load, so resetting the flag only affects the next load.
  const [isAutoStartPending, setIsAutoStartPending] = useState(
    () => !hasCompletedIntroTour(),
  )
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
