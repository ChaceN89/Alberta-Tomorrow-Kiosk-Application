/**
  File: MediaPlayerTutorial.tsx | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Nov 5, 2026

  Description:
  - Guide learners through the shared media player tutorial the first time they use it.

  Usage:
  - Render inside AudioPlayerPanel's stage so the player remains interactive.

  Notes:
  - The backdrop blocks the page while keeping the player and tutorial actions usable.
 */
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAudioPlayer } from '@/module-tools/media-player/hooks/useAudioPlayer'
import { useIntroTutorial } from '@/tutorials/specific-tutorials/intro-tutorial/useIntroTutorial'
import { TutorialPopover } from '@/tutorials/components/TutorialPopover'
import { TutorialStepContent } from '@/tutorials/components/TutorialStepContent'
import { useTutorialAnchorMeasurement } from '@/tutorials/hooks/useTutorialAnchorMeasurement'
import { getVerticalTutorialPosition } from '@/tutorials/utils/tutorialPositioning'
import {
  MEDIA_PLAYER_TUTORIAL_FINISH_REQUEST,
  MEDIA_PLAYER_TUTORIAL_PLAY_REQUEST,
  MEDIA_PLAYER_TUTORIAL_START_REQUEST,
} from './mediaPlayerTutorialEvents'
import {
  hasCompletedMediaPlayerTutorial,
  markMediaPlayerTutorialCompleted,
} from '@/save-data/tutorial-progress/mediaPlayerTutorialStorage'
import { mediaPlayerTutorialSteps } from './steps'

const PLAYER_TRANSITION_MS = 1300

export function MediaPlayerTutorial() {
  const { t } = useTranslation('tutorials')
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
  const { isActive: isIntroTutorialActive } = useIntroTutorial()
  const [hasCompletedTutorial, setHasCompletedTutorial] = useState(
    hasCompletedMediaPlayerTutorial,
  )
  const [requestedStepIndex, setRequestedStepIndex] = useState<number | null>(
    null,
  )
  const popupRef = useRef<HTMLElement | null>(null)
  const pausedTrackIdRef = useRef<string | null>(null)
  const titleId = useId()
  const descriptionId = useId()
  const hasTrack = track !== null
  const isTutorialEligible =
    hasTrack && !hasCompletedTutorial && !isIntroTutorialActive
  const requestedTutorialStepIndex = isTutorialEligible
    ? (requestedStepIndex ?? 0)
    : null
  const stepIndex =
    requestedTutorialStepIndex === 1 &&
    isPanelOpen &&
    activePanelTab === 'player'
      ? 2
      : requestedTutorialStepIndex
  const step = stepIndex === null ? null : mediaPlayerTutorialSteps[stepIndex]
  const anchor =
    stepIndex === 0 && isFullscreen ? 'player-controls' : (step?.anchor ?? null)
  const layoutKey = `${isFullscreen}:${isPanelOpen}`
  const measurement = useTutorialAnchorMeasurement({
    anchor,
    selector: anchor ? `[data-media-player-tutorial="${anchor}"]` : null,
    popupRef,
    layoutKey,
    followDurationMs: PLAYER_TRANSITION_MS,
  })
  const isPositioned = measurement !== null
  const position = measurement
    ? getVerticalTutorialPosition(
        measurement.targetRect,
        measurement.popupSize,
        step?.placement ?? 'above',
      )
    : null
  const isLastStep = stepIndex === mediaPlayerTutorialSteps.length - 1

  const finish = useCallback(
    (resumePausedPlayback = true) => {
      const shouldResumePlayback =
        resumePausedPlayback && pausedTrackIdRef.current === track?.id
      pausedTrackIdRef.current = null

      if (shouldResumePlayback) resumePlayback()

      markMediaPlayerTutorialCompleted()
      setHasCompletedTutorial(true)
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

    window.addEventListener(
      MEDIA_PLAYER_TUTORIAL_PLAY_REQUEST,
      finishOnPlayback,
    )
    return () =>
      window.removeEventListener(
        MEDIA_PLAYER_TUTORIAL_PLAY_REQUEST,
        finishOnPlayback,
      )
  }, [finish, stepIndex])

  useEffect(() => {
    const finishOnRequest = () => finish()

    window.addEventListener(
      MEDIA_PLAYER_TUTORIAL_FINISH_REQUEST,
      finishOnRequest,
    )
    return () =>
      window.removeEventListener(
        MEDIA_PLAYER_TUTORIAL_FINISH_REQUEST,
        finishOnRequest,
      )
  }, [finish])

  useEffect(() => {
    const startOnRequest = () => {
      setHasCompletedTutorial(false)
      setRequestedStepIndex(0)
    }

    window.addEventListener(MEDIA_PLAYER_TUTORIAL_START_REQUEST, startOnRequest)
    return () =>
      window.removeEventListener(
        MEDIA_PLAYER_TUTORIAL_START_REQUEST,
        startOnRequest,
      )
  }, [])

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
      <div aria-hidden="true" className="audio-player-tutorial-backdrop" />
      <TutorialPopover
        popupRef={popupRef}
        titleId={titleId}
        descriptionId={descriptionId}
        position={position}
        isVisible={isPositioned}
        unpositionedStyle={{ inset: 'auto', margin: 0, left: 0, top: 0 }}
        className={`audio-player-tutorial-popup overflow-visible rounded-2xl border border-line bg-surface p-0 text-ink shadow-2xl ${
          isPositioned ? 'audio-player-tutorial-popup--visible' : ''
        }`}
      >
        <TutorialStepContent
          titleId={titleId}
          descriptionId={descriptionId}
          stepLabel={t('tutorialStepCount', {
            current: stepIndex + 1,
            total: mediaPlayerTutorialSteps.length,
          })}
          stepLabelClassName="text-xs font-semibold text-muted"
          title={t(`mediaPlayer.${step.id}.title`)}
          titleClassName="text-xl"
          description={t(`mediaPlayer.${step.id}.description`)}
          className="relative p-5 md:p-6"
          actions={
            <>
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
            </>
          }
        />
      </TutorialPopover>
    </>
  )
}
