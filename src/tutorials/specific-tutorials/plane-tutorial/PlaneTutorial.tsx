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
import type { CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import { markPlaneTutorialCompleted } from '@/save-data/tutorial-progress/planeTutorialStorage'
import { PLANE_TUTORIAL_START_REQUEST } from './planeTutorialEvents'

type PlaneTutorialProps = {
  onFinish: () => void
  onPause: (isPaused: boolean) => void
  onControlsStepChange: (isControlsStep: boolean) => void
}

type CoachMarkPosition = {
  style: CSSProperties
  arrowTop: number
  arrowSide: 'left' | 'right'
}

const STEP_COUNT = 2
const VIEWPORT_MARGIN = 16
const POPOVER_GAP = 14
const ARROW_MARGIN = 24

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function PlaneTutorial({
  onFinish,
  onPause,
  onControlsStepChange,
}: PlaneTutorialProps) {
  const { t } = useTranslation('tutorials')
  const [step, setStep] = useState(0)
  const [position, setPosition] = useState<CoachMarkPosition | null>(null)
  const popupRef = useRef<HTMLElement>(null)
  const titleId = useId()
  const descriptionId = useId()
  const stepId = step === 0 ? 'explore' : 'controls'

  useEffect(() => {
    const restartTutorial = () => {
      setStep(0)
      setPosition(null)
      onControlsStepChange(false)
      onPause(true)
    }

    window.addEventListener(PLANE_TUTORIAL_START_REQUEST, restartTutorial)
    return () =>
      window.removeEventListener(PLANE_TUTORIAL_START_REQUEST, restartTutorial)
  }, [onControlsStepChange, onPause])

  useEffect(() => {
    if (step === 0) {
      return
    }

    let frameId = 0
    const measure = () => {
      const target = document.querySelector('[data-plane-controls="true"]')
      const popup = popupRef.current
      if (!target || !popup) return

      const targetRect = target.getBoundingClientRect()
      const popupRect = popup.getBoundingClientRect()
      const mapInfoPanel = document.querySelector('.map-info-panel--open')
      const mapInfoPanelLeft =
        mapInfoPanel?.getBoundingClientRect().left ??
        window.innerWidth - VIEWPORT_MARGIN
      const availableRight = mapInfoPanelLeft - targetRect.right - POPOVER_GAP
      const placeRight = availableRight >= Math.min(popupRect.width, 280)
      const width = placeRight
        ? Math.min(popupRect.width, availableRight)
        : popupRect.width
      const left = placeRight
        ? targetRect.right + POPOVER_GAP
        : Math.max(VIEWPORT_MARGIN, targetRect.left - POPOVER_GAP - width)
      const top = clamp(
        targetRect.top + targetRect.height / 2 - popupRect.height / 2,
        VIEWPORT_MARGIN,
        window.innerHeight - popupRect.height - VIEWPORT_MARGIN,
      )

      const nextPosition: CoachMarkPosition = {
        style: { inset: 'auto', margin: 0, left, top, width },
        arrowSide: placeRight ? 'left' : 'right',
        arrowTop: clamp(
          targetRect.top + targetRect.height / 2 - top,
          ARROW_MARGIN,
          popupRect.height - ARROW_MARGIN,
        ),
      }

      setPosition((current) =>
        current?.style.left === left &&
        current.style.top === top &&
        current.style.width === width &&
        current.arrowTop === nextPosition.arrowTop
          ? current
          : nextPosition,
      )
      if (width < popupRect.width) {
        frameId = requestAnimationFrame(measure)
      }
    }
    const scheduleMeasure = () => {
      cancelAnimationFrame(frameId)
      frameId = requestAnimationFrame(measure)
    }
    const initialMeasure = window.setTimeout(measure, 0)

    window.addEventListener('resize', scheduleMeasure)
    return () => {
      window.clearTimeout(initialMeasure)
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', scheduleMeasure)
    }
  }, [step])

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
    <section
      ref={popupRef}
      role="dialog"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      style={
        step === 0
          ? undefined
          : {
              ...(position?.style ?? {
                inset: 'auto',
                margin: 0,
                left: 0,
                top: 0,
              }),
              visibility: position ? 'visible' : 'hidden',
            }
      }
      className={`plane-tutorial ${
        step === 0
          ? 'plane-tutorial--intro'
          : 'plane-tutorial--controls plane-tutorial--anchored'
      }`}
    >
      {step === 1 && position && (
        <span
          aria-hidden="true"
          className={`plane-tutorial__arrow plane-tutorial__arrow--${position.arrowSide}`}
          style={{ top: position.arrowTop }}
        />
      )}
      <div className="plane-tutorial__content">
        <p className="text-sm font-semibold text-muted">
          {t('tutorialStepCount', { current: step + 1, total: STEP_COUNT })}
        </p>
        <h2 id={titleId}>{t(`plane.${stepId}.title`)}</h2>
        <p id={descriptionId} className="text-muted">
          {t(`plane.${stepId}.description`)}
        </p>
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <button type="button" className="text-link" onClick={skip}>
            {t('skip')}
          </button>
          <button type="button" className="button" onClick={next}>
            {t(step === 0 ? 'next' : 'plane.done')}
          </button>
        </div>
      </div>
    </section>
  )
}
