/**
  File: AudioPlayerPanel.tsx | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Shared audio and video player with a media queue and full-screen playback.
  - Slides out from the left edge; the active media type selects its playback view.

  Usage:
  - Render once inside Layout. It appears when a track is loaded and opens on play.

  Notes:
  - Closing unfinished media or a player with queued items asks for confirmation.
  - The player and scrollable queue have separate tabs; duplicate queue entries are removable.
 */
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Tooltip } from '../../components/shared/Tooltip'
import { useJournal } from '../../journal/useJournal'
import {
  CloseIcon,
  ExitFullscreenIcon,
  FastForwardIcon,
  FullscreenIcon,
  MusicNoteIcon,
  MoveDownIcon,
  MoveUpIcon,
  NextIcon,
  PauseIcon,
  PlayIcon,
  QueueListIcon,
  RewindIcon,
  VideoIcon,
  VolumeIcon,
} from './AudioPlayerIcons'
import { formatTime } from './formatTime'
import { useAudioPlayer, type MediaTrack } from './useAudioPlayer'
import { createPortal } from 'react-dom'
import { YouTubePlayer } from './YouTubePlayer'

function EqualizerBars() {
  return (
    <span aria-hidden="true" className="flex h-5 items-end gap-0.5">
      {[0, 200, 400].map((delay) => (
        <span
          key={delay}
          className="audio-bar h-full w-1 rounded-full bg-current"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </span>
  )
}

export function AudioPlayerPanel() {
  const { t, i18n } = useTranslation('moduleTools')
  const { isOpen: isJournalOpen } = useJournal()
  const {
    track,
    isPlaying,
    hasError,
    isPanelOpen,
    isFullscreen,
    setFullscreen,
    beginClose,
    activePanelTab,
    currentTime,
    duration,
    playbackRate,
    volume,
    queue,
    togglePlayback,
    seek,
    setVolume,
    speedUp,
    slowDown,
    playNext,
    removeFromQueue,
    moveInQueue,
    setPanelOpen,
    setActivePanelTab,
    stop,
    onVideoPlayerReady,
    onVideoPlayingChange,
    onMediaEnded,
    onPlaybackError,
  } = useAudioPlayer()
  const [isConfirmingClose, setConfirmingClose] = useState(false)
  const [isAnimatingClose, setAnimatingClose] = useState(false)
  const [isVolumeOpen, setVolumeOpen] = useState(false)
  const cancelCloseRef = useRef<HTMLButtonElement>(null)
  const fullscreenExitRef = useRef<HTMLButtonElement>(null)
  const closeAnimationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  )
  const currentTrackIdRef = useRef(track?.id ?? null)
  const closeTitleId = useId()
  const volumeControlId = useId()

  const exitFullscreen = useCallback(
    () => setFullscreen(false),
    [setFullscreen],
  )

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
    if (!isFullscreen) return
    fullscreenExitRef.current?.focus()
    const exitOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') exitFullscreen()
    }
    document.addEventListener('keydown', exitOnEscape)
    return () => document.removeEventListener('keydown', exitOnEscape)
  }, [exitFullscreen, isFullscreen])

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

  useEffect(() => {
    if (!isVolumeOpen) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setVolumeOpen(false)
    }

    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [isVolumeOpen])

  useEffect(
    () => () => {
      if (closeAnimationTimeoutRef.current) {
        clearTimeout(closeAnimationTimeoutRef.current)
      }
    },
    [],
  )

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

  const rateLabel = `${playbackRate}×`
  const selectTab = (nextTab: 'player' | 'queue') => {
    if (isPanelOpen && activePanelTab === nextTab) {
      setPanelOpen(false)
      return
    }

    setActivePanelTab(nextTab)
    setPanelOpen(true)
  }
  const closePlayer = () => {
    setConfirmingClose(false)
    setAnimatingClose(true)
    setFullscreen(false)
    setVolumeOpen(false)
    const closingTrackId = track.id

    beginClose()

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
  const playerTabLabel = t(
    isPanelOpen && activePanelTab === 'player'
      ? 'audioPlayer.collapse'
      : isPlaying
        ? 'audioPlayer.expandPlaying'
        : 'audioPlayer.showPlayer',
  )
  const playbackTabLabel = t(
    isPlaying ? 'audioPlayer.pause' : 'audioPlayer.play',
  )
  const queueTabLabel = t('audioPlayer.openQueueWithCount', {
    count: queue.length,
  })
  const sideTabClass = isFullscreen
    ? 'audio-player-tab--hidden'
    : !isPanelOpen
      ? 'audio-player-tab-enter'
      : ''
  const stageExitAnimationClass =
    isAnimatingClose && isPanelOpen ? 'audio-panel-exit' : ''
  const frameExitAnimationClass = isAnimatingClose
    ? isPanelOpen
      ? 'audio-panel-exit'
      : 'audio-panel-exit--collapsed'
    : ''
  const playerTab = (
    <button
      type="button"
      className="pointer-events-auto flex h-16 w-10 items-center justify-center rounded-r-xl border border-l-0 border-line bg-pine text-white shadow-lg transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:scale-105 motion-reduce:transition-none"
      aria-expanded={isPanelOpen && activePanelTab === 'player'}
      aria-label={playerTabLabel}
      onClick={() => selectTab('player')}
    >
      {isPlaying ? <EqualizerBars /> : <MusicNoteIcon className="size-5" />}
    </button>
  )
  const queueTab = (
    <button
      type="button"
      className="pointer-events-auto relative flex h-16 w-10 items-center justify-center rounded-r-xl border border-l-0 border-line bg-pine text-white shadow-lg transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:scale-105 motion-reduce:transition-none"
      aria-expanded={isPanelOpen && activePanelTab === 'queue'}
      aria-label={queueTabLabel}
      onClick={() => selectTab('queue')}
    >
      <QueueListIcon className="size-5" />
      {queue.length > 0 && (
        <span
          aria-hidden="true"
          className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border border-pine bg-surface px-1 text-[10px] font-bold leading-none text-pine shadow-sm"
        >
          {queue.length > 99 ? '99+' : queue.length}
        </span>
      )}
    </button>
  )
  const playbackTab = (
    <button
      type="button"
      className="pointer-events-auto flex h-16 w-10 items-center justify-center rounded-r-xl border border-l-0 border-line bg-surface text-pine shadow-lg transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:scale-105 motion-reduce:transition-none"
      aria-label={playbackTabLabel}
      onClick={togglePlayback}
    >
      {isPlaying ? (
        <PauseIcon className="size-5" />
      ) : (
        <PlayIcon className="size-5" />
      )}
    </button>
  )
  const closeTab = (
    <button
      type="button"
      className="pointer-events-auto flex h-16 w-10 items-center justify-center rounded-r-xl border border-l-0 border-line bg-flag text-white shadow-lg transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:scale-105 motion-reduce:transition-none"
      aria-label={t('audioPlayer.close')}
      onClick={requestClose}
    >
      <CloseIcon className="size-5" />
    </button>
  )
  const renderQueueContent = (showRemoveButton = true) =>
    queue.length > 0 ? (
      <ol className="min-h-0 min-w-0 flex-1 space-y-2 overflow-x-hidden overflow-y-auto overscroll-contain pr-2 scrollbar-thin">
        {queue.map(({ queueId, track: queuedTrack }, index) => {
          const queuedTitle = getTrackTitle(queuedTrack)

          return (
            <li key={queueId} className="flex min-w-0 items-center gap-2">
              <img
                src={queuedTrack.coverArt}
                alt=""
                className="size-10 shrink-0 rounded object-cover"
              />
              {queuedTrack.type === 'audio' ? (
                <MusicNoteIcon className="size-4 shrink-0 text-muted" />
              ) : (
                <VideoIcon className="size-4 shrink-0 text-muted" />
              )}
              <span className="min-w-0 grow truncate text-sm">
                {queuedTitle}
              </span>
              <div className="flex shrink-0">
                <button
                  type="button"
                  className="flex size-10 items-center justify-center rounded-lg text-muted hover:bg-canvas disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label={t('audioPlayer.moveUp', {
                    title: queuedTitle,
                  })}
                  disabled={index === 0}
                  onClick={() => moveInQueue(queueId, 'up')}
                >
                  <MoveUpIcon className="size-4" />
                </button>
                <button
                  type="button"
                  className="flex size-10 items-center justify-center rounded-lg text-muted hover:bg-canvas disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label={t('audioPlayer.moveDown', {
                    title: queuedTitle,
                  })}
                  disabled={index === queue.length - 1}
                  onClick={() => moveInQueue(queueId, 'down')}
                >
                  <MoveDownIcon className="size-4" />
                </button>
              </div>
              {showRemoveButton && (
                <button
                  type="button"
                  className="flex size-10 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-canvas"
                  aria-label={t('audioPlayer.removeFromQueue', {
                    title: queuedTitle,
                  })}
                  onClick={() => removeFromQueue(queueId)}
                >
                  <CloseIcon className="size-4" />
                </button>
              )}
            </li>
          )
        })}
      </ol>
    ) : (
      <p className="text-sm text-muted">{t('audioPlayer.queueEmpty')}</p>
    )
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
          inert={!isPanelOpen}
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
                <div
                  className={`audio-player-controls flex min-h-0 min-w-0 flex-col ${
                    isFullscreen
                      ? 'gap-3 overflow-y-auto p-3 md:p-4'
                      : 'justify-start gap-2 p-2'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{trackTitle}</p>
                      {trackSubtitle && (
                        <p className="truncate text-sm text-muted">
                          {trackSubtitle}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {track.type === 'audio' && (
                        <div className="relative">
                          <Tooltip text={t('audioPlayer.volume')}>
                            <button
                              type="button"
                              className="flex size-10 items-center justify-center rounded-lg text-muted hover:bg-canvas"
                              aria-label={t('audioPlayer.volume')}
                              aria-expanded={isVolumeOpen}
                              aria-controls={volumeControlId}
                              onClick={() => setVolumeOpen(!isVolumeOpen)}
                            >
                              <VolumeIcon className="size-5" />
                            </button>
                          </Tooltip>
                          {isVolumeOpen && (
                            <div
                              id={volumeControlId}
                              className="absolute right-full top-1/2 z-30 mr-2 flex -translate-y-1/2 flex-col items-center gap-2 rounded-xl border border-line bg-surface p-3 text-ink shadow-xl"
                            >
                              <label
                                htmlFor="audio-player-volume"
                                className="sr-only"
                              >
                                {t('audioPlayer.volume')}
                              </label>
                              <input
                                id="audio-player-volume"
                                type="range"
                                min={0}
                                max={1}
                                step={0.01}
                                value={volume}
                                aria-valuetext={t('audioPlayer.volumeValue', {
                                  percent: Math.round(volume * 100),
                                })}
                                className="h-32 w-8 cursor-pointer accent-pine"
                                style={{
                                  writingMode: 'vertical-lr',
                                  direction: 'rtl',
                                }}
                                onChange={(event) =>
                                  setVolume(event.target.valueAsNumber)
                                }
                              />
                              <span className="text-xs text-muted tabular-nums">
                                {Math.round(volume * 100)}%
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                      {isFullscreen ? (
                        <Tooltip text={t('audioPlayer.exitFullscreen')}>
                          <button
                            ref={fullscreenExitRef}
                            type="button"
                            className="flex size-10 items-center justify-center rounded-lg border border-line bg-surface/95 text-ink shadow-lg hover:bg-surface"
                            aria-label={t('audioPlayer.exitFullscreen')}
                            onClick={exitFullscreen}
                          >
                            <ExitFullscreenIcon className="size-5" />
                          </button>
                        </Tooltip>
                      ) : (
                        <Tooltip text={t('audioPlayer.fullscreen')}>
                          <button
                            type="button"
                            className="flex size-10 items-center justify-center rounded-lg text-muted hover:bg-canvas"
                            aria-label={t('audioPlayer.fullscreen')}
                            onClick={() => setFullscreen(true)}
                          >
                            <FullscreenIcon className="size-5" />
                          </button>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                  {hasError && (
                    <p role="alert" className="text-sm font-medium text-flag">
                      {t('audioPlayer.error')}
                    </p>
                  )}
                  {track.type === 'audio' && (
                    <div>
                      <input
                        type="range"
                        min={0}
                        max={duration || 1}
                        step={0.1}
                        value={Math.min(currentTime, duration || 1)}
                        disabled={duration === 0}
                        aria-label={t('audioPlayer.seek')}
                        aria-valuetext={t('audioPlayer.position', {
                          current: formatTime(currentTime),
                          total: formatTime(duration),
                        })}
                        className="h-8 w-full cursor-pointer accent-pine disabled:cursor-not-allowed"
                        onChange={(event) => seek(event.target.valueAsNumber)}
                      />
                      <div className="flex justify-between text-xs text-muted tabular-nums">
                        <span>{formatTime(currentTime)}</span>
                        <span>{rateLabel}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-center gap-3">
                    {track.type === 'audio' && (
                      <Tooltip text={t('audioPlayer.slowerTooltip')}>
                        <button
                          type="button"
                          className="button-secondary size-12 rounded-full p-0"
                          aria-label={t('audioPlayer.slower', {
                            rate: rateLabel,
                          })}
                          onClick={slowDown}
                        >
                          <RewindIcon />
                        </button>
                      </Tooltip>
                    )}
                    <button
                      type="button"
                      className="button size-14 rounded-full p-0"
                      aria-label={t(
                        isPlaying ? 'audioPlayer.pause' : 'audioPlayer.play',
                      )}
                      onClick={togglePlayback}
                    >
                      {isPlaying ? (
                        <PauseIcon className="size-7" />
                      ) : (
                        <PlayIcon className="size-7" />
                      )}
                    </button>
                    {track.type === 'audio' && (
                      <Tooltip text={t('audioPlayer.fasterTooltip')}>
                        <button
                          type="button"
                          className="button-secondary size-12 rounded-full p-0"
                          aria-label={t('audioPlayer.faster', {
                            rate: rateLabel,
                          })}
                          onClick={speedUp}
                        >
                          <FastForwardIcon />
                        </button>
                      </Tooltip>
                    )}
                    {queue.length > 0 && (
                      <Tooltip text={t('audioPlayer.next')}>
                        <button
                          type="button"
                          className="button size-12 rounded-lg p-0"
                          aria-label={t('audioPlayer.next')}
                          onClick={playNext}
                        >
                          <NextIcon />
                        </button>
                      </Tooltip>
                    )}
                  </div>
                  <p className="sr-only" role="status">
                    {isPlaying
                      ? t('audioPlayer.nowPlaying', { title: trackTitle })
                      : ''}
                  </p>
                </div>
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
                  <h2 className="mb-2 shrink-0 text-lg font-semibold">
                    {t('audioPlayer.queueWithCount', {
                      count: queue.length,
                    })}
                  </h2>
                  {renderQueueContent(false)}
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
              {renderQueueContent()}
            </section>
          </div>
        </section>
        <div
          inert={isFullscreen}
          aria-hidden={isFullscreen}
          className={`audio-player-tab absolute bottom-55 left-full ${sideTabClass}`}
        >
          {isPanelOpen ? (
            closeTab
          ) : (
            <Tooltip text={t('audioPlayer.close')}>{closeTab}</Tooltip>
          )}
        </div>
        <div
          inert={isFullscreen}
          aria-hidden={isFullscreen}
          className={`audio-player-tab absolute bottom-38 left-full ${sideTabClass}`}
        >
          {isPanelOpen ? (
            playbackTab
          ) : (
            <Tooltip text={playbackTabLabel}>{playbackTab}</Tooltip>
          )}
        </div>
        <div
          inert={isFullscreen}
          aria-hidden={isFullscreen}
          className={`audio-player-tab absolute bottom-21 left-full ${sideTabClass}`}
        >
          {isPanelOpen ? (
            playerTab
          ) : (
            <Tooltip text={playerTabLabel}>{playerTab}</Tooltip>
          )}
        </div>
        <div
          inert={isFullscreen}
          aria-hidden={isFullscreen}
          className={`audio-player-tab absolute bottom-4 left-full ${sideTabClass}`}
        >
          {isPanelOpen ? (
            queueTab
          ) : (
            <Tooltip text={queueTabLabel}>{queueTab}</Tooltip>
          )}
        </div>
        {isConfirmingClose && (
          <div
            className={`audio-close-dialog pointer-events-auto absolute inset-0 z-100 grid place-items-center bg-ink/50 p-4 ${
              !isPanelOpen && !isFullscreen
                ? 'audio-close-dialog--collapsed'
                : ''
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
