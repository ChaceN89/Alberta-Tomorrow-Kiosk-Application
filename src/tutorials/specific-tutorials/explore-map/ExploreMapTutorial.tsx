/**
  File: ExploreMapTutorial.tsx | Author: Chace Nielson
  Date Created: Nov 5, 2026
  Date Updated: Nov 5, 2026

  Description:
  - Introduce the map and its points of interest on the first Explore visit.

  Usage:
  - Render inside AlbertaMap so the tutorial is shared by both Explore routes.

  Notes:
  - The map must be ready before the tutorial opens over the startup screen.
 */
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  INTRO_TO_MAP_TUTORIAL_STORAGE_EVENT,
  hasCompletedIntroToMapTutorial,
  markIntroToMapTutorialCompleted,
} from '@/save-data/tutorial-progress/introToMapTutorialStorage'
import { TutorialDialog } from '@/tutorials/components/TutorialDialog'
import { TutorialPopover } from '@/tutorials/components/TutorialPopover'
import { TutorialStepContent } from '@/tutorials/components/TutorialStepContent'
import { useTutorialAnchorMeasurement } from '@/tutorials/hooks/useTutorialAnchorMeasurement'
import { getVerticalTutorialPosition } from '@/tutorials/utils/tutorialPositioning'
import {
  EXPLORE_MAP_TUTORIAL_FINISH_REQUEST,
  EXPLORE_MAP_TUTORIAL_START_REQUEST,
} from './exploreMapTutorialEvents'
import { exploreMapTutorialSteps } from './steps'

const START_DELAY_MS = 350

type ExploreMapTutorialProps = {
  isMapReady: boolean
}

export function ExploreMapTutorial({ isMapReady }: ExploreMapTutorialProps) {
  const { t } = useTranslation('tutorials')
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null)
  const [shouldAutoStart] = useState(() => !hasCompletedIntroToMapTutorial())
  const [isStartRequested, setIsStartRequested] = useState(false)
  const [hasCompleted, setHasCompleted] = useState(
    hasCompletedIntroToMapTutorial,
  )
  const titleId = useId()
  const descriptionId = useId()
  const finish = useCallback(() => {
    markIntroToMapTutorialCompleted()
    setHasCompleted(true)
    setActiveStepIndex(null)
  }, [])

  useEffect(() => {
    const syncCompletion = () => {
      const completed = hasCompletedIntroToMapTutorial()
      setHasCompleted(completed)
      if (completed) setActiveStepIndex(null)
    }

    window.addEventListener(INTRO_TO_MAP_TUTORIAL_STORAGE_EVENT, syncCompletion)
    return () =>
      window.removeEventListener(
        INTRO_TO_MAP_TUTORIAL_STORAGE_EVENT,
        syncCompletion,
      )
  }, [])

  useEffect(() => {
    const startTutorial = () => {
      setHasCompleted(false)
      setIsStartRequested(true)
    }

    window.addEventListener(EXPLORE_MAP_TUTORIAL_START_REQUEST, startTutorial)
    return () =>
      window.removeEventListener(
        EXPLORE_MAP_TUTORIAL_START_REQUEST,
        startTutorial,
      )
  }, [])

  useEffect(() => {
    const finishTutorial = () => {
      if (activeStepIndex !== null) finish()
    }

    window.addEventListener(EXPLORE_MAP_TUTORIAL_FINISH_REQUEST, finishTutorial)
    return () =>
      window.removeEventListener(
        EXPLORE_MAP_TUTORIAL_FINISH_REQUEST,
        finishTutorial,
      )
  }, [activeStepIndex, finish])

  useEffect(() => {
    if (!isStartRequested || !isMapReady) return

    const timer = window.setTimeout(() => {
      setActiveStepIndex(0)
      setIsStartRequested(false)
    }, 0)
    return () => window.clearTimeout(timer)
  }, [isMapReady, isStartRequested])

  useEffect(() => {
    if (!shouldAutoStart || !isMapReady || hasCompleted) return

    const timer = window.setTimeout(() => setActiveStepIndex(0), START_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [hasCompleted, isMapReady, shouldAutoStart])

  const activeStep =
    activeStepIndex === null ? null : exploreMapTutorialSteps[activeStepIndex]

  useEffect(() => {
    if (activeStep?.mode !== 'popover') return

    const finishOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        finish()
      }
    }

    window.addEventListener('keydown', finishOnEscape)
    return () => window.removeEventListener('keydown', finishOnEscape)
  }, [activeStep?.mode, finish])

  if (!activeStep) return null

  const isLastStep = activeStepIndex === exploreMapTutorialSteps.length - 1
  const stepLabel = t('tutorialStepCount', {
    current: (activeStepIndex ?? 0) + 1,
    total: exploreMapTutorialSteps.length,
  })
  const title =
    activeStep.id === 'overview'
      ? t('exploreMap.title')
      : activeStep.id === 'viewToggle'
        ? t('exploreMap.viewToggle.title')
        : t('exploreMap.flyPlane.title')
  const description =
    activeStep.id === 'overview'
      ? t('exploreMap.description')
      : activeStep.id === 'viewToggle'
        ? t('exploreMap.viewToggle.description')
        : t('exploreMap.flyPlane.description')
  const actionLabel = t(isLastStep ? 'exploreMap.done' : 'next')
  const continueTutorial = () => {
    if (isLastStep) {
      finish()
    } else {
      setActiveStepIndex((current) =>
        current === null ? current : current + 1,
      )
    }
  }
  const actions = (
    <>
      <button type="button" className="text-link" onClick={finish}>
        {t('skip')}
      </button>
      <button
        type="button"
        className="button"
        autoFocus
        onClick={continueTutorial}
      >
        {actionLabel}
      </button>
    </>
  )

  if (activeStep.mode === 'dialog') {
    return (
      <TutorialDialog
        ariaLabelledBy={titleId}
        ariaDescribedBy={descriptionId}
        className="tutorial-dialog w-[min(32rem,calc(100vw-2rem))]"
        onCancel={finish}
      >
        <TutorialStepContent
          titleId={titleId}
          descriptionId={descriptionId}
          stepLabel={stepLabel}
          title={title}
          description={description}
          className="p-6"
          actions={actions}
        />
      </TutorialDialog>
    )
  }

  return (
    <AnchoredMapTutorialStep
      anchor={activeStep.anchor}
      placement={activeStep.placement}
      titleId={titleId}
      descriptionId={descriptionId}
      stepLabel={stepLabel}
      title={title}
      description={description}
      actions={actions}
    />
  )
}

type AnchoredMapTutorialStepProps = {
  anchor: string
  placement: 'above' | 'below'
  titleId: string
  descriptionId: string
  stepLabel: string
  title: string
  description: string
  actions: ReactNode
}

function AnchoredMapTutorialStep({
  anchor,
  placement,
  titleId,
  descriptionId,
  stepLabel,
  title,
  description,
  actions,
}: AnchoredMapTutorialStepProps) {
  const popupRef = useRef<HTMLElement | null>(null)
  const measurement = useTutorialAnchorMeasurement({
    anchor,
    selector: `[data-tutorial="${anchor}"]`,
    popupRef,
    layoutKey: `${title}:${description}`,
  })
  const position = measurement
    ? getVerticalTutorialPosition(
        measurement.targetRect,
        measurement.popupSize,
        placement,
      )
    : null

  return (
    <TutorialPopover
      popupRef={popupRef}
      titleId={titleId}
      descriptionId={descriptionId}
      position={position}
      isVisible={position !== null}
      unpositionedStyle={{ inset: 'auto', margin: 0, left: 0, top: 0 }}
      className="tutorial-map-popover"
    >
      <TutorialStepContent
        titleId={titleId}
        descriptionId={descriptionId}
        stepLabel={stepLabel}
        title={title}
        description={description}
        className="p-6"
        actions={actions}
      />
    </TutorialPopover>
  )
}
