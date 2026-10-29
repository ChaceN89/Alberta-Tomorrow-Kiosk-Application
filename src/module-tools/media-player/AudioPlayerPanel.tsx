/**
  File: AudioPlayerPanel.tsx | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Shared audio and video player with a media queue and full-screen playback.
  - Slides out from the left edge; the active media type selects its playback view.

  Usage:
  - Render once inside Layout. It appears when a track is loaded and opens on play.

  Notes:
  - Closing unfinished media or a player with queued items asks for confirmation.
  - The player and scrollable queue have separate tabs; duplicate queue entries are removable.
 */
import { useEffect, useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useJournal } from '@/journal/useJournal'
import { MediaPlayerTutorial } from '@/tutorials/media-player-tutorial/MediaPlayerTutorial'
import { AudioPlayerControls } from './AudioPlayerControls'
import { AudioPlayerQueueList } from './AudioPlayerQueueList'
import { AudioPlayerTabs } from './AudioPlayerTabs'
import '@/styles/AudioPlayer.css'
import { useAudioPlayer, type MediaTrack } from './useAudioPlayer'
import { createPortal } from 'react-dom'
import { YouTubePlayer } from './YouTubePlayer'

const FULLSCREEN_EXIT_DURATION_MS = 520
const MEDIA_END_CLOSE_DELAY_MS = 700

export function AudioPlayerPanel() {
  const { t, i18n } = useTranslation('moduleTools')
  const { isOpen: isJournalOpen } = useJournal()
  const {
    track,
    isPanelOpen,
    isFullscreen,
    isMediaEndClosing,
    setFullscreen,
    beginClose,
    activePanelTab,
    volume,
    queue,
    removeFromQueue,
    moveInQueue,
    stop,
    onVideoPlayerReady,
    onVideoPlayingChange,
    onMediaEnded,
    onPlaybackError,
  } = useAudioPlayer()
  const [isConfirmingClose, setConfirmingClose] = useState(false)
  const [isAnimatingClose, setAnimatingClose] = useState(false)
  const [isAnimatingFullscreenExit, setAnimatingFullscreenExit] =
    useState(false)
  const cancelCloseRef = useRef<HTMLButtonElement>(null)
  const closeAnimationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  )
  const currentTrackIdRef = useRef(track?.id ?? null)
  const closeTitleId = useId()

  useEffect(() => {
    currentTrackIdRef.current = track?.id ?? null
  }, [track?.id])

  useEffect(() => {
    if (!isConfirmingClose) return

    cancelCloseRef.current?.focus()
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setConfirmingClose(false)
    }

    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [isConfirmingClose])

  useEffect(() => {
    if (!isFullscreen || !track) return

    const root = document.documentElement
    const body = document.body
    const previousRootOverflow = root.style.overflow
    const previousBodyOverflow = body.style.overflow

    root.style.overflow = 'hidden'
    body.style.overflow = 'hidden'

    return () => {
      root.style.overflow = previousRootOverflow
      body.style.overflow = previousBodyOverflow
    }
  }, [isFullscreen, track])

  useEffect(
    () => () => {
      if (closeAnimationTimeoutRef.current) {
        clearTimeout(closeAnimationTimeoutRef.current)
      }
    },
    [],
  )

  useEffect(() => {
    if (!isMediaEndClosing) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const delay = isFullscreen ? MEDIA_END_CLOSE_DELAY_MS : 0
    const duration = prefersReducedMotion
      ? 0
      : isFullscreen
        ? FULLSCREEN_EXIT_DURATION_MS
        : 300
    const timeoutId = window.setTimeout(stop, delay + duration)

    return () => window.clearTimeout(timeoutId)
  }, [isFullscreen, isMediaEndClosing, stop])

  if (!track) return null

  const getTrackTitle = (mediaTrack: MediaTrack) =>
    mediaTrack.translation
      ? i18n.t(mediaTrack.translation.titleKey, {
          ns: mediaTrack.translation.namespace,
          defaultValue: mediaTrack.title,
        })
      : mediaTrack.title
  const getTrackSubtitle = (mediaTrack: MediaTrack) =>
    mediaTrack.translation?.subtitleKey
      ? i18n.t(mediaTrack.translation.subtitleKey, {
          ns: mediaTrack.translation.namespace,
          defaultValue: mediaTrack.subtitle ?? '',
        })
      : mediaTrack.subtitle
  const trackTitle = getTrackTitle(track)
  const trackSubtitle = getTrackSubtitle(track)

  const closePlayer = () => {
    setConfirmingClose(false)
    const closingTrackId = track.id

    beginClose()

    if (isFullscreen) {
      setAnimatingFullscreenExit(true)
      const duration = window.matchMedia('(prefers-reduced-motion: reduce)')
        .matches
        ? 0
        : FULLSCREEN_EXIT_DURATION_MS

      closeAnimationTimeoutRef.current = setTimeout(() => {
        closeAnimationTimeoutRef.current = null
        if (currentTrackIdRef.current === closingTrackId) {
          stop()
        }
        setAnimatingFullscreenExit(false)
      }, duration)
      return
    }

    setAnimatingClose(true)
    setFullscreen(false)
    closeAnimationTimeoutRef.current = setTimeout(() => {
      closeAnimationTimeoutRef.current = null
      if (currentTrackIdRef.current === closingTrackId) {
        stop()
      }
      setAnimatingClose(false)
    }, 300)
  }
  const requestClose = () => {
    if (queue.length > 0) {
      setConfirmingClose(true)
    } else {
      closePlayer()
    }
  }
  const isMediaEndFullscreenExit = isMediaEndClosing && isFullscreen
  const isCompactCloseAnimation = isAnimatingClose || isMediaEndClosing
  const isFullscreenCloseAnimation =
    isAnimatingFullscreenExit || isMediaEndFullscreenExit
  const stageExitAnimationClass = isFullscreenCloseAnimation
    ? `audio-player-stage--fullscreen-exit ${
        isMediaEndFullscreenExit ? 'audio-player-stage--media-end-exit' : ''
      }`
    : isCompactCloseAnimation && isPanelOpen
      ? 'audio-panel-exit'
      : ''
  const frameExitAnimationClass = isFullscreenCloseAnimation
    ? `audio-player-frame--fullscreen-exit ${
        isMediaEndFullscreenExit ? 'audio-player-frame--media-end-exit' : ''
      }`
    : isCompactCloseAnimation
      ? isPanelOpen
        ? 'audio-panel-exit'
        : 'audio-panel-exit--collapsed'
      : ''
  const journalAudioPortalRoot = isJournalOpen
    ? document.getElementById('journal-audio-player-root')
    : null

  if (isJournalOpen && !journalAudioPortalRoot) {
    throw new Error('The journal audio player portal root is missing.')
  }

  const panel = (
    <div
      className={`audio-player-stage ${
        isFullscreen ? 'audio-player-stage--fullscreen' : ''
      } ${stageExitAnimationClass}`}
    >
      <MediaPlayerTutorial />
      <div
        className={`audio-player-frame ${
          isFullscreen ? 'audio-player-frame--fullscreen' : ''
        } ${
          !isPanelOpen && !isFullscreen ? 'audio-player-frame--collapsed' : ''
        } ${frameExitAnimationClass}`}
      >
        <section
          aria-label={t('audioPlayer.label')}
          role={isFullscreen ? 'dialog' : undefined}
          aria-modal={isFullscreen ? true : undefined}
          inert={!isPanelOpen || isMediaEndClosing}
          className={`audio-player-card flex h-full w-full flex-col overflow-hidden border border-line bg-surface text-ink ${
            isFullscreen
              ? 'rounded-2xl shadow-2xl'
              : `rounded-r-2xl border-l-0 ${isPanelOpen ? 'shadow-xl' : ''}`
          }`}
        >
          <div className="audio-panel-view-stack relative h-full">
            <div
              aria-hidden={activePanelTab !== 'player'}
              inert={activePanelTab !== 'player'}
              className={`audio-panel-tab-view audio-panel-tab-view--player flex h-full flex-col ${
                activePanelTab === 'player'
                  ? 'audio-panel-tab-view--active'
                  : 'audio-panel-tab-view--inactive'
              }`}
            >
              <div
                className={`audio-player-media-viewport ${
                  isFullscreen
                    ? 'audio-player-media-viewport--fullscreen'
                    : 'audio-player-media-viewport--compact'
                }`}
              >
                {track.type === 'youtube' ? (
                  <YouTubePlayer
                    videoId={track.videoId}
                    title={track.title}
                    volume={volume}
                    onReady={onVideoPlayerReady}
                    onPlayingChange={onVideoPlayingChange}
                    onEnded={onMediaEnded}
                    onError={onPlaybackError}
                  />
                ) : (
                  <img
                    src={track.coverArt}
                    alt=""
                    className="audio-player-media-content size-full object-contain"
                  />
                )}
              </div>
              <div
                className={`audio-player-fullscreen-lower ${
                  isFullscreen
                    ? 'audio-player-fullscreen-lower--fullscreen'
                    : ''
                }`}
              >
                <AudioPlayerControls
                  trackTitle={trackTitle}
                  trackSubtitle={trackSubtitle}
                />
                <section
                  aria-label={t('audioPlayer.queueWithCount', {
                    count: queue.length,
                  })}
                  aria-hidden={!isFullscreen}
                  inert={!isFullscreen}
                  className={`audio-player-queue flex min-h-0 min-w-0 flex-col border-t border-line px-4 py-3 md:border-t-0 md:border-l ${
                    isFullscreen ? 'audio-player-queue--visible' : ''
                  }`}
                >
                  {isFullscreen && (
                    <button
                      type="button"
                      className="button-danger mb-3 min-h-10 w-full py-2"
                      onClick={requestClose}
                    >
                      {t('audioPlayer.close')}
                    </button>
                  )}
                  <h2 className="mb-2 shrink-0 text-lg font-semibold">
                    {t('audioPlayer.queueWithCount', {
                      count: queue.length,
                    })}
                  </h2>
                  <AudioPlayerQueueList
                    queue={queue}
                    getTrackTitle={getTrackTitle}
                    moveInQueue={moveInQueue}
                    removeFromQueue={removeFromQueue}
                  />
                </section>
              </div>
            </div>
            <section
              aria-label={t('audioPlayer.queue')}
              aria-hidden={activePanelTab !== 'queue'}
              inert={activePanelTab !== 'queue'}
              className={`audio-panel-tab-view audio-panel-tab-view--queue flex h-full min-w-0 flex-col p-4 ${
                activePanelTab === 'queue'
                  ? 'audio-panel-tab-view--active'
                  : 'audio-panel-tab-view--inactive'
              }`}
            >
              <div className="mb-3">
                <h2 className="text-lg font-semibold">
                  {t('audioPlayer.queueWithCount', {
                    count: queue.length,
                  })}
                </h2>
              </div>
              <AudioPlayerQueueList
                queue={queue}
                getTrackTitle={getTrackTitle}
                moveInQueue={moveInQueue}
                removeFromQueue={removeFromQueue}
              />
            </section>
          </div>
        </section>
        <AudioPlayerTabs requestClose={requestClose} />
        {isConfirmingClose && (
          <div
            className={`audio-close-dialog pointer-events-auto absolute inset-0 z-(--z-player-dialog) grid place-items-center p-4 ${
              !isPanelOpen && !isFullscreen
                ? 'audio-close-dialog--collapsed'
                : 'bg-ink/50'
            }`}
          >
            <div
              role="alertdialog"
              aria-modal="true"
              aria-labelledby={closeTitleId}
              className="audio-close-dialog__content w-full max-w-sm space-y-4 rounded-2xl border border-line bg-surface p-6 text-ink shadow-2xl"
            >
              <h2 id={closeTitleId}>{t('audioPlayer.confirmCloseTitle')}</h2>
              <p>{t('audioPlayer.confirmCloseDescription')}</p>
              <div className="flex flex-wrap justify-end gap-3">
                <button type="button" className="button" onClick={closePlayer}>
                  {t('audioPlayer.confirmClose')}
                </button>
                <button
                  ref={cancelCloseRef}
                  type="button"
                  className="button-secondary"
                  onClick={() => setConfirmingClose(false)}
                >
                  {t('audioPlayer.cancelClose')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return isJournalOpen && journalAudioPortalRoot
    ? createPortal(panel, journalAudioPortalRoot)
    : panel
}
