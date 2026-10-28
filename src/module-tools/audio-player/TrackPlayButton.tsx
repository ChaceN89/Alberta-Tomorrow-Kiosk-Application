/**
  File: TrackPlayButton.tsx | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Offer concise playback and queue actions for a module audio track.
  - Passes optional onStart and onEnd callbacks so modules can record checkpoints.

  Usage:
  - Render in any module with a track and callbacks, e.g. one that calls completeCheckpoint.

  Notes:
  - When a different track is playing, learners can queue this track or start it immediately.
  - A track can only appear once in the queue at a time.
 */
import { useTranslation } from 'react-i18next'
import { Tooltip } from '../../components/shared/Tooltip'
import { AddToQueueIcon, PauseIcon, PlayIcon } from './AudioPlayerIcons'
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
    isClosing,
    queue,
    playTrack,
    playNow,
    addToQueue,
    togglePlayback,
  } = useAudioPlayer()
  const isCurrent = current?.id === track.id
  const isActive = isCurrent && isPlaying
  const isQueued =
    current?.id === track.id || queue.some((item) => item.track.id === track.id)
  const callbacks = { onStart, onEnd }

  const action = isCurrent
    ? isActive
      ? 'pause'
      : isClosing || isEnded
        ? 'play'
        : 'resume'
    : isPlaying
      ? 'playNow'
      : 'play'

  const play = () => {
    if (isCurrent) {
      if (isActive) {
        togglePlayback()
      } else {
        playTrack(track, callbacks)
      }
    } else if (isQueued || isPlaying) {
      playNow(track, callbacks)
    } else {
      playTrack(track, callbacks)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        className="button gap-2"
        aria-label={t(
          action === 'playNow'
            ? 'audioPlayer.playNowTrack'
            : `audioPlayer.${action}Track`,
          { title: track.title },
        )}
        onClick={play}
      >
        {isActive ? (
          <PauseIcon className="size-5" />
        ) : (
          <PlayIcon className="size-5" />
        )}
        {t(`audioPlayer.${action}`)}
      </button>
      <Tooltip
        text={t(
          isQueued ? 'audioPlayer.alreadyInQueue' : 'audioPlayer.addToQueue',
        )}
      >
        <button
          type="button"
          className="button-secondary size-12 p-0 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
          aria-disabled={isQueued}
          aria-label={t(
            isQueued
              ? 'audioPlayer.alreadyInQueueTrack'
              : 'audioPlayer.addToQueueTrack',
            { title: track.title },
          )}
          onClick={() => {
            if (!isQueued) addToQueue(track, callbacks)
          }}
        >
          <AddToQueueIcon className="size-5" />
        </button>
      </Tooltip>
    </div>
  )
}
