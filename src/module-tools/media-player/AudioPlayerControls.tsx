/**
  File: AudioPlayerControls.tsx | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Render media metadata, volume, seek, playback-rate, and transport controls.

  Usage:
  - AudioPlayerPanel renders this below the active media viewport.

  Notes:
  - Fullscreen keyboard handling and the volume popover are owned with the controls.
 */
import { useEffect, useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Tooltip } from '../../components/shared/Tooltip'
import {
  ExitFullscreenIcon,
  FastForwardIcon,
  FullscreenIcon,
  NextIcon,
  PauseIcon,
  PlayIcon,
  RewindIcon,
  VolumeIcon,
} from './AudioPlayerIcons'
import { formatTime } from './formatTime'
import { useAudioPlayer } from './useAudioPlayer'

type AudioPlayerControlsProps = {
  trackTitle: string
  trackSubtitle: string | undefined
}

export function AudioPlayerControls({
  trackTitle,
  trackSubtitle,
}: AudioPlayerControlsProps) {
  const { t } = useTranslation('moduleTools')
  const {
    track,
    isPlaying,
    hasError,
    isFullscreen,
    isClosing,
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
    setFullscreen,
  } = useAudioPlayer()
  const [isVolumeOpen, setVolumeOpen] = useState(false)
  const fullscreenExitRef = useRef<HTMLButtonElement>(null)
  const volumeControlId = useId()

  useEffect(() => {
    if (!isFullscreen) return

    fullscreenExitRef.current?.focus()
    const exitOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setFullscreen(false)
    }

    document.addEventListener('keydown', exitOnEscape)
    return () => document.removeEventListener('keydown', exitOnEscape)
  }, [isFullscreen, setFullscreen])

  useEffect(() => {
    if (!isVolumeOpen) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setVolumeOpen(false)
    }

    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [isVolumeOpen])

  if (!track) return null

  const rateLabel = `${playbackRate}×`
  const isVolumeVisible = isVolumeOpen && !isClosing

  return (
    <div
      className={`audio-player-controls flex min-h-0 min-w-0 flex-col ${
        isFullscreen
          ? `gap-3 p-3 md:p-4 ${
              isVolumeVisible ? 'overflow-visible' : 'overflow-y-auto'
            }`
          : 'justify-start gap-2 p-2'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-semibold">{trackTitle}</p>
          {trackSubtitle && (
            <p className="truncate text-sm text-muted">{trackSubtitle}</p>
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
                  aria-expanded={isVolumeVisible}
                  aria-controls={volumeControlId}
                  onClick={() => setVolumeOpen(!isVolumeOpen)}
                >
                  <VolumeIcon className="size-5" />
                </button>
              </Tooltip>
              {isVolumeVisible && (
                <div
                  id={volumeControlId}
                  className="absolute right-full top-1/2 z-30 mr-2 flex -translate-y-1/2 flex-col items-center gap-2 rounded-xl border border-line bg-surface p-3 text-ink shadow-xl"
                >
                  <label htmlFor="audio-player-volume" className="sr-only">
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
                    onChange={(event) => setVolume(event.target.valueAsNumber)}
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
                onClick={() => setFullscreen(false)}
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
              aria-label={t('audioPlayer.slower', { rate: rateLabel })}
              onClick={slowDown}
            >
              <RewindIcon />
            </button>
          </Tooltip>
        )}
        <button
          type="button"
          className="button size-14 rounded-full p-0"
          aria-label={t(isPlaying ? 'audioPlayer.pause' : 'audioPlayer.play')}
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
              aria-label={t('audioPlayer.faster', { rate: rateLabel })}
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
        {isPlaying ? t('audioPlayer.nowPlaying', { title: trackTitle }) : ''}
      </p>
    </div>
  )
}
