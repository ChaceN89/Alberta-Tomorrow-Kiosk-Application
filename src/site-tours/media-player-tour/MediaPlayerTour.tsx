/**
  File: MediaPlayerTour.tsx | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Guide learners through the shared media player the first time they use it.

  Usage:
  - Render inside AudioPlayerPanel's stage so the player remains interactive.

  Notes:
  - The backdrop blocks the page while keeping the player and tour actions usable.
 */
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import { useTranslation } from 'react-i18next'
import { useAudioPlayer } from '../../module-tools/media-player/useAudioPlayer'
import { useIntroTour } from '../intro-tour/useIntroTour'
import { MEDIA_PLAYER_TOUR_PLAY_REQUEST } from './mediaPlayerTourEvents'
import {
  hasCompletedMediaPlayerTour,
  markMediaPlayerTourCompleted,
} from './mediaPlayerTourStorage'
import { mediaPlayerTourSteps, type MediaPlayerTourAnchor } from './steps'

const POPUP_MARGIN = 16
const POPUP_GAP = 14
const ARROW_INSET = 28
const PLAYER_TRANSITION_MS = 1300

type MeasuredTourPosition = {
  anchor: MediaPlayerTourAnchor
  style: CSSProperties
  arrow: { left: number; above: boolean }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function MediaPlayerTour() {
  const { t } = useTranslation('introTour')
  const {
    track,
    isPlaying,
    isFullscreen,
    isPanelOpen,
    activePanelTab,
    setFullscreen,
    setPanelOpen,
    pausePlayback,
    resumePlayback,
  } = useAudioPlayer()
  const { isActive: isIntroTourActive } = useIntroTour()
  const [hasCompletedTour, setHasCompletedTour] = useState(
    hasCompletedMediaPlayerTour,
  )
  const [requestedStepIndex, setRequestedStepIndex] = useState<number | null>(
    null,
  )
  const [measured, setMeasured] = useState<MeasuredTourPosition | null>(null)
  const popupRef = useRef<HTMLElement>(null)
  const pausedTrackIdRef = useRef<string | null>(null)
  const previousLayoutRef = useRef({ isFullscreen, isPanelOpen })
  const titleId = useId()
  const descriptionId = useId()
  const hasTrack = track !== null
  const isTourEligible = hasTrack && !hasCompletedTour && !isIntroTourActive
  const requestedTourStepIndex = isTourEligible
    ? (requestedStepIndex ?? 0)
    : null
  const stepIndex =
    requestedTourStepIndex === 1 && isPanelOpen && activePanelTab === 'player'
      ? 2
      : requestedTourStepIndex
  const step = stepIndex === null ? null : mediaPlayerTourSteps[stepIndex]
  const anchor =
    stepIndex === 0 && isFullscreen ? 'player-controls' : (step?.anchor ?? null)
  const isPositioned = anchor !== null && measured?.anchor === anchor
  const isLastStep = stepIndex === mediaPlayerTourSteps.length - 1

  const finish = useCallback(
    (resumePausedPlayback = true) => {
      const shouldResumePlayback =
        resumePausedPlayback && pausedTrackIdRef.current === track?.id
      pausedTrackIdRef.current = null

      if (shouldResumePlayback) resumePlayback()

      markMediaPlayerTourCompleted()
      setHasCompletedTour(true)
      setRequestedStepIndex(null)
    },
    [resumePlayback, track?.id],
  )

  useEffect(() => {
    if (stepIndex === null || !track) return

    if (isPlaying) {
      pausedTrackIdRef.current = track.id
    } else if (pausedTrackIdRef.current === track.id) {
      return
    }

    pausePlayback()
  }, [isPlaying, pausePlayback, stepIndex, track])

  useEffect(() => {
    if (stepIndex === null) return

    const finishOnPlayback = () => finish(false)

    window.addEventListener(MEDIA_PLAYER_TOUR_PLAY_REQUEST, finishOnPlayback)
    return () =>
      window.removeEventListener(
        MEDIA_PLAYER_TOUR_PLAY_REQUEST,
        finishOnPlayback,
      )
  }, [finish, stepIndex])

  useEffect(() => {
    if (!anchor) return

    let frame = 0
    let transitionFrame = 0
    const layoutChanged =
      previousLayoutRef.current.isFullscreen !== isFullscreen ||
      previousLayoutRef.current.isPanelOpen !== isPanelOpen
    previousLayoutRef.current = { isFullscreen, isPanelOpen }
    const measure = () => {
      const target = document.querySelector(
        `[data-media-player-tour="${anchor}"]`,
      )
      const popup = popupRef.current

      if (!target || !popup) return

      const rect = target.getBoundingClientRect()
      const { width, height } = popup.getBoundingClientRect()
      const center = rect.left + rect.width / 2
      const left = clamp(
        center - width / 2,
        POPUP_MARGIN,
        window.innerWidth - width - POPUP_MARGIN,
      )
      const roomAbove = rect.top - POPUP_GAP - POPUP_MARGIN
      const roomBelow =
        window.innerHeight - rect.bottom - POPUP_GAP - POPUP_MARGIN
      const placeAbove =
        step?.placement === 'above'
          ? roomAbove >= height || roomBelow < height
          : roomBelow < height && roomAbove >= height
      const top = placeAbove
        ? Math.max(POPUP_MARGIN, rect.top - POPUP_GAP - height)
        : Math.min(
            rect.bottom + POPUP_GAP,
            window.innerHeight - height - POPUP_MARGIN,
          )

      const nextMeasured: MeasuredTourPosition = {
        anchor,
        style: { inset: 'auto', margin: 0, left, top },
        arrow: {
          left: clamp(center - left, ARROW_INSET, width - ARROW_INSET),
          above: placeAbove,
        },
      }

      setMeasured((current) =>
        current?.anchor === anchor &&
        current.style.left === left &&
        current.style.top === top
          ? current
          : nextMeasured,
      )
    }
    const schedule = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(measure)
    }
    const initialMeasure = window.setTimeout(measure, 0)

    if (layoutChanged) {
      const transitionStartedAt = performance.now()
      const followPlayerTransition = () => {
        measure()
        if (performance.now() - transitionStartedAt < PLAYER_TRANSITION_MS) {
          transitionFrame = requestAnimationFrame(followPlayerTransition)
        }
      }

      followPlayerTransition()
    }

    window.addEventListener('resize', schedule)
    window.addEventListener('scroll', schedule, true)

    return () => {
      window.clearTimeout(initialMeasure)
      cancelAnimationFrame(frame)
      cancelAnimationFrame(transitionFrame)
      window.removeEventListener('resize', schedule)
      window.removeEventListener('scroll', schedule, true)
    }
  }, [anchor, isFullscreen, isPanelOpen, step?.placement])

  useEffect(() => {
    if (stepIndex === null) return

    const finishOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        finish()
      }
    }

    document.addEventListener('keydown', finishOnEscape)
    return () => document.removeEventListener('keydown', finishOnEscape)
  }, [finish, stepIndex])

  if (!step || stepIndex === null) return null

  const next = () => {
    setFullscreen(false)
    setPanelOpen(false)
    setRequestedStepIndex(1)
  }

  return (
    <>
      <div aria-hidden="true" className="audio-player-tour-backdrop" />
      <section
        ref={popupRef}
        role="dialog"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        style={{
          ...(isPositioned
            ? measured.style
            : { inset: 'auto', margin: 0, left: 0, top: 0 }),
          visibility: isPositioned ? 'visible' : 'hidden',
        }}
        className={`audio-player-tour-popup overflow-visible rounded-2xl border border-line bg-surface p-0 text-ink shadow-2xl ${
          isPositioned ? 'audio-player-tour-popup--visible' : ''
        }`}
      >
        {isPositioned && (
          <span
            aria-hidden="true"
            className={`absolute size-4 rotate-45 border-line bg-surface ${
              measured.arrow.above
                ? '-bottom-2 border-r border-b'
                : '-top-2 border-t border-l'
            }`}
            style={{ left: measured.arrow.left - 8 }}
          />
        )}
        <div className="relative space-y-4 p-5 md:p-6">
          <p className="text-xs font-semibold text-muted">
            {t('stepCount', {
              current: stepIndex + 1,
              total: mediaPlayerTourSteps.length,
            })}
          </p>
          <h2 id={titleId} className="text-xl">
            {t(`mediaPlayer.${step.id}.title`)}
          </h2>
          <p id={descriptionId} className="text-muted">
            {t(`mediaPlayer.${step.id}.description`)}
          </p>
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            {stepIndex !== 1 && (
              <button
                type="button"
                className="button"
                onClick={isLastStep ? () => finish() : next}
              >
                {t(isLastStep ? 'mediaPlayer.done' : 'next')}
              </button>
            )}
            {!isLastStep && (
              <button
                type="button"
                className="text-link"
                onClick={() => finish()}
              >
                {t('skip')}
              </button>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
