/**
  File: IntroTutorial.tsx | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Show the first-visit tutorial in a click-blocking dialog with anchored arrows.

  Usage:
  - Layout components render in the app shell.

  Notes:
  - None.
 */
import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import logo from '@/assets/expedition.svg'
import '@/styles/IntroTutorial.css'
import {
  introTutorialSteps,
  type TutorialAnchor,
} from '@/tutorials/intro-tutorial/steps'
import { useIntroTutorial } from '@/tutorials/intro-tutorial/useIntroTutorial'

const POPUP_MARGIN = 16
const POPUP_GAP = 14
const ARROW_INSET = 28

type MeasuredAnchor = {
  anchor: TutorialAnchor
  rect: DOMRect
  width: number
  height: number
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function IntroTutorialDialog() {
  const { t } = useTranslation('tutorials')
  const { stepIndex, next, finish } = useIntroTutorial()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [measured, setMeasured] = useState<MeasuredAnchor | null>(null)
  const titleId = useId()
  const descriptionId = useId()
  const step = introTutorialSteps[stepIndex]
  const anchor = step && 'anchor' in step ? step.anchor : null
  const isLastStep = stepIndex === introTutorialSteps.length - 1

  useEffect(() => {
    const dialog = dialogRef.current

    dialog?.showModal()

    return () => dialog?.close()
  }, [])

  useEffect(() => {
    if (!anchor) return

    const selector = `[data-tutorial="${anchor}"]`
    let frame = 0
    const measure = () => {
      const element = document.querySelector(selector)
      const dialog = dialogRef.current

      setMeasured(
        element && dialog
          ? {
              anchor,
              rect: element.getBoundingClientRect(),
              width: dialog.offsetWidth,
              height: dialog.offsetHeight,
            }
          : null,
      )
    }
    const schedule = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(measure)
    }

    const target = document.querySelector(selector)
    const targetTop = target?.getBoundingClientRect().top ?? 0

    // Only scroll when the target's top edge is off screen.
    if (target && (targetTop < 0 || targetTop > window.innerHeight - 120)) {
      target.scrollIntoView({ block: 'start' })
    }
    // A timer, unlike requestAnimationFrame, also runs in a hidden tab.
    const initialMeasure = window.setTimeout(measure, 0)
    window.addEventListener('resize', schedule)
    window.addEventListener('scroll', schedule, true)

    return () => {
      window.clearTimeout(initialMeasure)
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', schedule)
      window.removeEventListener('scroll', schedule, true)
    }
  }, [anchor])

  if (!step) return null

  const target = anchor && measured?.anchor === anchor ? measured : null
  const isMeasuring = anchor !== null && target === null
  let style: CSSProperties | undefined
  let arrow: { left: number; above: boolean } | null = null

  if (target && 'placement' in step) {
    const { rect, width, height } = target
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const center = rect.left + rect.width / 2
    const left = clamp(
      center - width / 2,
      POPUP_MARGIN,
      viewportWidth - width - POPUP_MARGIN,
    )
    const roomAbove = rect.top - POPUP_GAP - POPUP_MARGIN
    const roomBelow = viewportHeight - rect.bottom - POPUP_GAP - POPUP_MARGIN
    const placeAbove =
      step.placement === 'above'
        ? roomAbove >= height || roomBelow < height
        : roomBelow < height && roomAbove >= height
    // Keep the popup on screen, overlapping the target a little if needed.
    const top = placeAbove
      ? Math.max(POPUP_MARGIN, rect.top - POPUP_GAP - height)
      : Math.min(
          rect.bottom + POPUP_GAP,
          viewportHeight - height - POPUP_MARGIN,
        )

    style = { inset: 'auto', margin: 0, left, top }
    arrow = {
      left: clamp(center - left, ARROW_INSET, width - ARROW_INSET),
      above: placeAbove,
    }
  }

  const isCentered = anchor === null
  const actionLabel =
    step.id === 'welcome'
      ? t('welcome.start')
      : step.id === 'finish'
        ? t('finish.start')
        : t('next')

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      style={style}
      className={`overflow-visible rounded-2xl border border-line bg-surface p-0 text-ink shadow-2xl backdrop:bg-transparent ${
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
      onCancel={(event) => {
        event.preventDefault()

        if (
          document.activeElement instanceof Element &&
          document.activeElement.closest('[id$="-dev-tools-root"]')
        ) {
          return
        }

        finish()
      }}
    >
      {arrow && (
        <span
          aria-hidden="true"
          className={`absolute size-4 rotate-45 border-line bg-surface ${
            arrow.above
              ? '-bottom-2 border-r border-b'
              : '-top-2 border-t border-l'
          }`}
          style={{ left: arrow.left - 8 }}
        />
      )}
      <div className="relative space-y-4 p-5 md:p-6">
        {isCentered && <img src={logo} alt="" className="size-14" />}
        <p className="text-xs font-semibold text-muted">
          {t('tutorialStepCount', {
            current: stepIndex + 1,
            total: introTutorialSteps.length,
          })}
        </p>
        <h2 id={titleId} className="text-xl">
          {t(`${step.id}.title`)}
        </h2>
        <p id={descriptionId} className="text-muted">
          {t(`${step.id}.description`)}
        </p>
        {step.id === 'welcome' && (
          <ul className="list-disc space-y-2 pl-5 text-muted">
            {t('welcome.structure', { returnObjects: true }).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
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
        </div>
      </div>
    </dialog>
  )
}

export function IntroTutorial() {
  const { isActive } = useIntroTutorial()

  return isActive ? <IntroTutorialDialog /> : null
}
