/**
  File: usePlaneTutorialState.ts | Author: Chace Nielson
  Date Created: Nov 8, 2026
  Date Updated: Nov 8, 2026

  Description:
  - Manage first-flight tutorial state and its start request event.

  Usage:
  - Used by AlbertaMap to coordinate the flyover controls and tutorial overlay.

  Notes:
  - A tutorial requested during a transition starts after flyover exits.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import type { FlyoverPhase } from '../flyover/types'
import {
  hasCompletedPlaneTutorial,
  PLANE_TUTORIAL_STORAGE_EVENT,
  resetPlaneTutorial,
} from '@/save-data/tutorial-progress/planeTutorialStorage'
import { PLANE_TUTORIAL_START_REQUEST } from '@/tutorials/specific-tutorials/plane-tutorial/planeTutorialEvents'

type UsePlaneTutorialStateOptions = {
  flyoverPhase: FlyoverPhase
  isMapReady: boolean
  isStyleLoading: boolean
  onStartFlyover: (pauseAfterEntry: boolean) => void
  onSetFlyoverPaused: (isPaused: boolean) => void
}

export function usePlaneTutorialState({
  flyoverPhase,
  isMapReady,
  isStyleLoading,
  onStartFlyover,
  onSetFlyoverPaused,
}: UsePlaneTutorialStateOptions) {
  const [isPlaneTutorialControlsStep, setIsPlaneTutorialControlsStep] =
    useState(false)
  const [hasCompletedPlaneTour, setHasCompletedPlaneTour] = useState(
    hasCompletedPlaneTutorial,
  )
  const pendingPlaneTutorialStart = useRef(false)

  useEffect(() => {
    const syncCompletion = () =>
      setHasCompletedPlaneTour(hasCompletedPlaneTutorial())

    window.addEventListener(PLANE_TUTORIAL_STORAGE_EVENT, syncCompletion)
    return () =>
      window.removeEventListener(PLANE_TUTORIAL_STORAGE_EVENT, syncCompletion)
  }, [])

  useEffect(() => {
    const startPlaneTutorial = () => {
      resetPlaneTutorial()
      setHasCompletedPlaneTour(false)
      setIsPlaneTutorialControlsStep(false)

      if (flyoverPhase === 'off') {
        if (isMapReady && !isStyleLoading) {
          onStartFlyover(true)
        } else {
          pendingPlaneTutorialStart.current = true
        }
      } else if (flyoverPhase === 'exiting') {
        pendingPlaneTutorialStart.current = true
      } else {
        onSetFlyoverPaused(true)
      }
    }

    window.addEventListener(PLANE_TUTORIAL_START_REQUEST, startPlaneTutorial)
    return () =>
      window.removeEventListener(
        PLANE_TUTORIAL_START_REQUEST,
        startPlaneTutorial,
      )
  }, [
    flyoverPhase,
    isMapReady,
    isStyleLoading,
    onSetFlyoverPaused,
    onStartFlyover,
  ])

  useEffect(() => {
    if (
      flyoverPhase !== 'off' ||
      !isMapReady ||
      isStyleLoading ||
      !pendingPlaneTutorialStart.current
    ) {
      return
    }

    pendingPlaneTutorialStart.current = false
    onStartFlyover(true)
  }, [flyoverPhase, isMapReady, isStyleLoading, onStartFlyover])

  const finishPlaneTutorial = useCallback(() => {
    setHasCompletedPlaneTour(true)
    setIsPlaneTutorialControlsStep(false)
  }, [])
  const isPlaneTutorialActive =
    (flyoverPhase === 'entering' || flyoverPhase === 'flying') &&
    !hasCompletedPlaneTour

  return {
    hasCompletedPlaneTour,
    isPlaneTutorialActive,
    isPlaneTutorialControlsStep,
    setIsPlaneTutorialControlsStep,
    finishPlaneTutorial,
  }
}
