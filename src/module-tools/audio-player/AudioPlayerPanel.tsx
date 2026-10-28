/**
  File: AudioPlayerPanel.tsx | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Corner mp3-style player with cover art, seeking, volume, speed controls, and a queue.
  - Slides out from the left edge; while collapsed, its tab shows animated bars during playback.

  Usage:
  - Render once inside Layout. It appears when a track is loaded and opens on play.

  Notes:
  - Closing unfinished audio or a player with queued items asks for confirmation.
  - The player and scrollable queue have separate tabs; duplicate queue entries are removable.
 */
import { useEffect, useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Tooltip } from '../../components/shared/Tooltip'
import {
  CloseIcon,
  FastForwardIcon,
  MusicNoteIcon,
  NextIcon,
  PauseIcon,
  PlayIcon,
  QueueListIcon,
  RewindIcon,
} from './AudioPlayerIcons'
import { formatTime } from './formatTime'
import { useAudioPlayer } from './useAudioPlayer'

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
  const { t } = useTranslation('moduleTools')
  const {
    track,
    isPlaying,
    isEnded,
    hasError,
    isPanelOpen,
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
    setPanelOpen,
    setActivePanelTab,
    stop,
  } = useAudioPlayer()
  const [isConfirmingClose, setConfirmingClose] = useState(false)
  const [isClosing, setClosing] = useState(false)
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

  useEffect(
    () => () => {
      if (closeAnimationTimeoutRef.current) {
        clearTimeout(closeAnimationTimeoutRef.current)
      }
    },
    [],
  )

  if (!track) return null

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
    setClosing(true)
    const closingTrackId = track.id

    if (isPlaying) togglePlayback()

    closeAnimationTimeoutRef.current = setTimeout(() => {
      closeAnimationTimeoutRef.current = null
      if (currentTrackIdRef.current === closingTrackId) {
        stop()
      }
      setClosing(false)
    }, 300)
  }
  const requestClose = () => {
    if (!isEnded || queue.length > 0) {
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
  const playerTab = (
    <button
      type="button"
      className="flex h-16 w-10 items-center justify-center rounded-r-xl border border-l-0 border-line bg-pine text-white shadow-lg"
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
      className="flex h-16 w-10 items-center justify-center rounded-r-xl border border-l-0 border-line bg-pine text-white shadow-lg"
      aria-expanded={isPanelOpen && activePanelTab === 'queue'}
      aria-label={t('audioPlayer.openQueue')}
      onClick={() => selectTab('queue')}
    >
      <QueueListIcon className="size-5" />
    </button>
  )

  return (
    <div
      className={`audio-player-shell audio-panel-enter fixed bottom-4 left-0 z-40 ${
        isClosing ? 'audio-panel-exit pointer-events-none' : ''
      }`}
    >
      <div
        className={`relative w-[min(20rem,calc(100vw-3rem))] transition-transform duration-300 ease-out motion-reduce:transition-none ${
          isPanelOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <section
          aria-label={t('audioPlayer.label')}
          inert={!isPanelOpen}
          className={`min-h-[28.3rem] overflow-hidden rounded-r-2xl border border-l-0 border-line bg-surface text-ink ${
            isPanelOpen ? 'shadow-xl' : ''
          }`}
        >
          <div className="audio-panel-view-stack relative min-h-[28.3rem]">
            <div
              aria-hidden={activePanelTab !== 'player'}
              inert={activePanelTab !== 'player'}
              className={`audio-panel-tab-view audio-panel-tab-view--player ${
                activePanelTab === 'player'
                  ? 'audio-panel-tab-view--active'
                  : 'audio-panel-tab-view--inactive'
              }`}
            >
              <div className="aspect-video w-full bg-canvas">
                <img
                  src={track.coverArt}
                  alt=""
                  className="size-full object-contain"
                />
              </div>
              <div className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{track.title}</p>
                    {track.subtitle && (
                      <p className="truncate text-sm text-muted">
                        {track.subtitle}
                      </p>
                    )}
                  </div>
                  <Tooltip text={t('audioPlayer.close')}>
                    <button
                      type="button"
                      className="flex size-10 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-canvas"
                      aria-label={t('audioPlayer.close')}
                      onClick={requestClose}
                    >
                      <CloseIcon className="size-5" />
                    </button>
                  </Tooltip>
                </div>
                {hasError && (
                  <p role="alert" className="text-sm font-medium text-flag">
                    {t('audioPlayer.error')}
                  </p>
                )}
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
                <div className="flex items-center justify-center gap-3">
                  <Tooltip text={t('audioPlayer.slowerTooltip')}>
                    <button
                      type="button"
                      className="button-secondary size-12 rounded-full p-0"
                      aria-label={t('audioPlayer.slower', { rate: rateLabel })}
                      onClick={slowDown}
                    >
                      <RewindIcon />
                    </button>
                  </Tooltip>
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
                  <Tooltip text={t('audioPlayer.fasterTooltip')}>
                    <button
                      type="button"
                      className="button-secondary size-12 rounded-full p-0"
                      aria-label={t('audioPlayer.faster', { rate: rateLabel })}
                      onClick={speedUp}
                    >
                      <FastForwardIcon />
                    </button>
                  </Tooltip>
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
                <div className="flex items-center gap-3">
                  <label
                    htmlFor="audio-player-volume"
                    className="shrink-0 text-sm font-medium"
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
                    className="h-8 min-w-0 grow cursor-pointer accent-pine"
                    onChange={(event) => setVolume(event.target.valueAsNumber)}
                  />
                  <span className="w-10 text-right text-xs text-muted tabular-nums">
                    {Math.round(volume * 100)}%
                  </span>
                </div>
                <p className="sr-only" role="status">
                  {isPlaying
                    ? t('audioPlayer.nowPlaying', { title: track.title })
                    : ''}
                </p>
              </div>
            </div>
            <section
              aria-label={t('audioPlayer.queue')}
              aria-hidden={activePanelTab !== 'queue'}
              inert={activePanelTab !== 'queue'}
              className={`audio-panel-tab-view audio-panel-tab-view--queue min-h-[28.3rem] p-4 ${
                activePanelTab === 'queue'
                  ? 'audio-panel-tab-view--active'
                  : 'audio-panel-tab-view--inactive'
              }`}
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <h2 className="text-lg font-semibold">
                  {t('audioPlayer.queueCount', { count: queue.length })}
                </h2>
                <Tooltip text={t('audioPlayer.close')}>
                  <button
                    type="button"
                    className="flex size-10 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-canvas"
                    aria-label={t('audioPlayer.close')}
                    onClick={requestClose}
                  >
                    <CloseIcon className="size-5" />
                  </button>
                </Tooltip>
              </div>
              {queue.length > 0 ? (
                <ol className="max-h-80 space-y-2 overflow-y-auto">
                  {queue.map(({ queueId, track: queuedTrack }) => (
                    <li
                      key={queueId}
                      className="flex min-w-0 items-center gap-2"
                    >
                      <img
                        src={queuedTrack.coverArt}
                        alt=""
                        className="size-10 shrink-0 rounded object-cover"
                      />
                      <span className="min-w-0 grow truncate text-sm">
                        {queuedTrack.title}
                      </span>
                      <button
                        type="button"
                        className="flex size-10 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-canvas"
                        aria-label={t('audioPlayer.removeFromQueue', {
                          title: queuedTrack.title,
                        })}
                        onClick={() => removeFromQueue(queueId)}
                      >
                        <CloseIcon className="size-4" />
                      </button>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm text-muted">
                  {t('audioPlayer.queueEmpty')}
                </p>
              )}
            </section>
          </div>
        </section>
        <div className="absolute bottom-20 left-full">
          {isPanelOpen ? (
            playerTab
          ) : (
            <Tooltip text={playerTabLabel}>{playerTab}</Tooltip>
          )}
        </div>
        <div className="absolute bottom-4 left-full">
          {isPanelOpen ? (
            queueTab
          ) : (
            <Tooltip text={t('audioPlayer.openQueue')}>{queueTab}</Tooltip>
          )}
        </div>
      </div>
      {isConfirmingClose && (
        <div className="audio-close-dialog fixed inset-0 z-100 grid place-items-center bg-ink/50 p-4">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={closeTitleId}
            className="audio-close-dialog__content w-full max-w-sm space-y-4 rounded-2xl border border-line bg-surface p-6 text-ink shadow-2xl"
          >
            <h2 id={closeTitleId}>{t('audioPlayer.confirmCloseTitle')}</h2>
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
  )
}
