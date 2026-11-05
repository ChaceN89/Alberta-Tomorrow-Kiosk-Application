/**
  File: IntroTutorial.tsx | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Nov 5, 2026

  Description:
  - Show the first-visit tutorial in a click-blocking dialog with anchored arrows.

  Usage:
  - Layout components render in the app shell.

  Notes:
  - None.
 */
import { useId, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import logo from '@/assets/expedition.svg'
import '@/styles/IntroTutorial.css'
import { TutorialDialog } from '@/tutorials/components/TutorialDialog'
import { TutorialStepContent } from '@/tutorials/components/TutorialStepContent'
import { useTutorialAnchorMeasurement } from '@/tutorials/hooks/useTutorialAnchorMeasurement'
import { introTutorialSteps } from '@/tutorials/specific-tutorials/intro-tutorial/steps'
import { useIntroTutorial } from '@/tutorials/specific-tutorials/intro-tutorial/useIntroTutorial'
import { getVerticalTutorialPosition } from '@/tutorials/utils/tutorialPositioning'

function IntroTutorialDialog() {
  const { t } = useTranslation('tutorials')
  const { stepIndex, next, finish } = useIntroTutorial()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const descriptionId = useId()
  const step = introTutorialSteps[stepIndex]
  const anchor = step && 'anchor' in step ? step.anchor : null
  const isLastStep = stepIndex === introTutorialSteps.length - 1
  const measurement = useTutorialAnchorMeasurement({
    anchor,
    selector: anchor ? `[data-tutorial="${anchor}"]` : null,
    popupRef: dialogRef,
    scrollTargetIntoView: true,
  })

  if (!step) return null

  const target = measurement?.anchor === anchor ? measurement : null
  const isMeasuring = anchor !== null && target === null
  const position =
    target && 'placement' in step
      ? getVerticalTutorialPosition(
          target.targetRect,
          target.popupSize,
          step.placement,
        )
      : null

  const isCentered = anchor === null
  const actionLabel =
    step.id === 'welcome'
      ? t('welcome.start')
      : step.id === 'finish'
        ? t('finish.start')
        : t('next')
  const handleCancel = () => {
    if (
      document.activeElement instanceof Element &&
      document.activeElement.closest('[id$="-dev-tools-root"]')
    ) {
      return
    }

    finish()
  }

  return (
    <TutorialDialog
      dialogRef={dialogRef}
      ariaLabelledBy={titleId}
      ariaDescribedBy={descriptionId}
      style={position?.style}
      className={`tutorial-dialog tutorial-dialog--intro overflow-visible text-ink backdrop:bg-transparent ${
        isCentered
          ? 'm-auto w-[min(36.4rem,calc(100vw-2rem))] backdrop:backdrop-blur-sm'
          : 'w-[min(28.6rem,calc(100vw-2rem))]'
      } ${isMeasuring ? 'opacity-0' : ''} ${
        // Alternating names restart the animation on every step; pointer steps
        // wait until they are positioned so they don't animate in the wrong spot.
        isMeasuring
          ? ''
          : stepIndex % 2 === 0
            ? 'tutorial-pop-a'
            : 'tutorial-pop-b'
      }`}
      onCancel={handleCancel}
    >
      {position && (
        <span
          aria-hidden="true"
          className={`tutorial-popover__arrow tutorial-popover__arrow--${position.arrow.side}`}
          style={{ left: position.arrow.offset - 8 }}
        />
      )}
      <TutorialStepContent
        titleId={titleId}
        descriptionId={descriptionId}
        stepLabel={t('tutorialStepCount', {
          current: stepIndex + 1,
          total: introTutorialSteps.length,
        })}
        stepLabelClassName="text-xs font-semibold text-muted"
        title={t(`${step.id}.title`)}
        titleClassName="text-xl"
        description={t(`${step.id}.description`)}
        leadingContent={
          isCentered && <img src={logo} alt="" className="size-14" />
        }
        className="relative p-5 md:p-6"
        actions={
          <>
            <button
              type="button"
              className="button"
              autoFocus
              onClick={isLastStep ? finish : next}
            >
              {actionLabel}
            </button>
            {!isLastStep && (
              <button type="button" className="text-link" onClick={finish}>
                {t('skip')}
              </button>
            )}
          </>
        }
      >
        {step.id === 'welcome' && (
          <ul className="list-disc space-y-2 pl-5 text-muted">
            {t('welcome.structure', { returnObjects: true }).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
      </TutorialStepContent>
    </TutorialDialog>
  )
}

export function IntroTutorial() {
  const { isActive } = useIntroTutorial()

  return isActive ? <IntroTutorialDialog /> : null
}
