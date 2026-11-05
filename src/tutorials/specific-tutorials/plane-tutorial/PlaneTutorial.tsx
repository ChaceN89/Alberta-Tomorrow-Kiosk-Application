/**
  File: PlaneTutorial.tsx | Author: Chace Nielson
  Date Created: Nov 5, 2026
  Date Updated: Nov 5, 2026

  Description:
  - Introduce free flight and point-of-interest navigation, then spotlight controls.

  Usage:
  - Render inside AlbertaMap while the first-flight tutorial is active.

  Notes:
  - The non-modal coach mark leaves map POI navigation available during step one.
 */
import { useEffect, useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { markPlaneTutorialCompleted } from '@/save-data/tutorial-progress/planeTutorialStorage'
import { TutorialPopover } from '@/tutorials/components/TutorialPopover'
import { TutorialStepContent } from '@/tutorials/components/TutorialStepContent'
import { useTutorialAnchorMeasurement } from '@/tutorials/hooks/useTutorialAnchorMeasurement'
import { getSideTutorialPosition } from '@/tutorials/utils/tutorialPositioning'
import { PLANE_TUTORIAL_START_REQUEST } from './planeTutorialEvents'

type PlaneTutorialProps = {
  onFinish: () => void
  onPause: (isPaused: boolean) => void
  onControlsStepChange: (isControlsStep: boolean) => void
}

const STEP_COUNT = 2

export function PlaneTutorial({
  onFinish,
  onPause,
  onControlsStepChange,
}: PlaneTutorialProps) {
  const { t } = useTranslation('tutorials')
  const [step, setStep] = useState(0)
  const popupRef = useRef<HTMLElement | null>(null)
  const titleId = useId()
  const descriptionId = useId()
  const stepId = step === 0 ? 'explore' : 'controls'
  const anchor = step === 1 ? 'plane-controls' : null
  const measurement = useTutorialAnchorMeasurement({
    anchor,
    selector: anchor ? '[data-plane-controls="true"]' : null,
    obstructionSelector: '.map-info-panel--open',
    popupRef,
  })
  const position = measurement
    ? getSideTutorialPosition(
        measurement.targetRect,
        measurement.popupSize,
        measurement.obstructionRect?.left ?? window.innerWidth - 16,
      )
    : null

  useEffect(() => {
    const restartTutorial = () => {
      setStep(0)
      onControlsStepChange(false)
      onPause(true)
    }

    window.addEventListener(PLANE_TUTORIAL_START_REQUEST, restartTutorial)
    return () =>
      window.removeEventListener(PLANE_TUTORIAL_START_REQUEST, restartTutorial)
  }, [onControlsStepChange, onPause])

  const next = () => {
    if (step === 0) {
      onPause(true)
      onControlsStepChange(true)
      setStep(1)
      return
    }

    markPlaneTutorialCompleted()
    onFinish()
    onPause(false)
    onControlsStepChange(false)
  }

  const skip = () => {
    markPlaneTutorialCompleted()
    onFinish()
    onPause(false)
    onControlsStepChange(false)
  }

  return (
    <TutorialPopover
      key={step}
      popupRef={popupRef}
      titleId={titleId}
      descriptionId={descriptionId}
      position={step === 1 ? position : null}
      isVisible={step === 0 || position !== null}
      unpositionedStyle={
        step === 1 ? { inset: 'auto', margin: 0, left: 0, top: 0 } : undefined
      }
      className={`plane-tutorial ${
        step === 0
          ? 'plane-tutorial--intro'
          : 'plane-tutorial--controls plane-tutorial--anchored'
      }`}
    >
      <TutorialStepContent
        titleId={titleId}
        descriptionId={descriptionId}
        stepLabel={t('tutorialStepCount', {
          current: step + 1,
          total: STEP_COUNT,
        })}
        title={t(`plane.${stepId}.title`)}
        description={t(`plane.${stepId}.description`)}
        className="p-6"
        skipAction={{ label: t('skip'), onClick: skip }}
        nextAction={{
          label: t(step === 0 ? 'next' : 'plane.done'),
          onClick: next,
        }}
      />
    </TutorialPopover>
  )
}
