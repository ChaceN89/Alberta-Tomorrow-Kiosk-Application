/**
  File: TrackPlayButton.tsx | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Offer play, pause/resume, queue, and play-now actions for a module audio track.
  - Passes optional onStart and onEnd callbacks so modules can record checkpoints.

  Usage:
  - Render in any module with a track and callbacks, e.g. one that calls completeCheckpoint.

  Notes:
  - When a different track is playing, learners can queue this track or start it immediately.
  - Queued tracks can be added again or started immediately.
 */
import { useTranslation } from 'react-i18next'
import { PauseIcon, PlayIcon } from './AudioPlayerIcons'
import {
  useAudioPlayer,
  type AudioPlayCallbacks,
  type AudioTrack,
} from './useAudioPlayer'

type TrackPlayButtonProps = AudioPlayCallbacks & {
  track: AudioTrack
}

export function TrackPlayButton({
  track,
  onStart,
  onEnd,
}: TrackPlayButtonProps) {
  const { t } = useTranslation('moduleTools')
  const {
    track: current,
    isPlaying,
    isEnded,
    queue,
    playTrack,
    playNow,
    addToQueue,
    togglePlayback,
  } = useAudioPlayer()
  const isCurrent = current?.id === track.id
  const isActive = isCurrent && isPlaying
  const isQueued = queue.some((item) => item.track.id === track.id)
  const callbacks = { onStart, onEnd }

  if (isCurrent) {
    const action = isActive ? 'pause' : isEnded ? 'play' : 'resume'

    return (
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="button gap-2"
          aria-label={t(`audioPlayer.${action}Track`, { title: track.title })}
          onClick={() =>
            isActive ? togglePlayback() : playTrack(track, callbacks)
          }
        >
          {isActive ? (
            <PauseIcon className="size-5" />
          ) : (
            <PlayIcon className="size-5" />
          )}
          {t(`audioPlayer.${action}`)}
        </button>
        <button
          type="button"
          className="button-secondary"
          aria-label={t('audioPlayer.addToQueueTrack', { title: track.title })}
          onClick={() => addToQueue(track, callbacks)}
        >
          {t('audioPlayer.addToQueue')}
        </button>
      </div>
    )
  }

  if (isQueued) {
    return (
      <div className="flex flex-wrap gap-2">
        <button type="button" className="button-secondary" disabled>
          {t('audioPlayer.queued')}
        </button>
        <button
          type="button"
          className="button-secondary"
          aria-label={t('audioPlayer.addToQueueTrack', { title: track.title })}
          onClick={() => addToQueue(track, callbacks)}
        >
          {t('audioPlayer.addToQueue')}
        </button>
        <button
          type="button"
          className="button"
          aria-label={t('audioPlayer.playNowTrack', { title: track.title })}
          onClick={() => playNow(track, callbacks)}
        >
          <PlayIcon className="mr-2 size-5" />
          {t('audioPlayer.playNow')}
        </button>
      </div>
    )
  }

  if (current) {
    return (
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="button-secondary"
          aria-label={t('audioPlayer.addToQueueTrack', { title: track.title })}
          onClick={() => addToQueue(track, callbacks)}
        >
          {t('audioPlayer.addToQueue')}
        </button>
        <button
          type="button"
          className="button"
          aria-label={t('audioPlayer.playNowTrack', { title: track.title })}
          onClick={() => playNow(track, callbacks)}
        >
          <PlayIcon className="mr-2 size-5" />
          {t('audioPlayer.playNow')}
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      className="button gap-2"
      aria-label={t('audioPlayer.playTrack', { title: track.title })}
      onClick={() => playTrack(track, callbacks)}
    >
      <PlayIcon className="size-5" />
      {t('audioPlayer.play')}
    </button>
  )
}
