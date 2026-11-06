/**
  File: DirectVideoPlayer.tsx | Author: Chace Nielson
  Date Created: Nov 6, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Render a local or remote video track in the shared media viewport.

  Usage:
  - Rendered by PlayerMedia for direct video tracks.

  Notes:
  - Playback and transport state are synchronized with AudioPlayerProvider.
 */
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAudioPlayer } from '../hooks/useAudioPlayer'
import type { VideoTrack } from '../provider/types'

type DirectVideoPlayerProps = {
  track: VideoTrack
}

export function DirectVideoPlayer({ track }: DirectVideoPlayerProps) {
  const { t } = useTranslation('moduleTools')
  const [isLoading, setLoading] = useState(true)
  const {
    registerDirectVideoElement,
    onVideoPlayingChange,
    onDirectVideoTimeUpdate,
    onDirectVideoDurationChange,
    onDirectVideoPlaybackRateChange,
    onMediaEnded,
    onPlaybackError,
  } = useAudioPlayer()

  return (
    <>
      <video
        ref={registerDirectVideoElement}
        src={track.src}
        poster={track.coverArt}
        preload="metadata"
        playsInline
        aria-label={track.title}
        className="audio-player-media-content audio-player-direct-video size-full object-contain"
        onPlay={() => {
          onVideoPlayingChange(true)
        }}
        onPause={() => onVideoPlayingChange(false)}
        onLoadedData={() => setLoading(false)}
        onEnded={onMediaEnded}
        onError={() => {
          setLoading(false)
          onPlaybackError()
        }}
        onTimeUpdate={(event) =>
          onDirectVideoTimeUpdate(event.currentTarget.currentTime)
        }
        onDurationChange={(event) => {
          const { duration } = event.currentTarget
          onDirectVideoDurationChange(Number.isFinite(duration) ? duration : 0)
        }}
        onRateChange={(event) =>
          onDirectVideoPlaybackRateChange(event.currentTarget.playbackRate)
        }
      />
      {track.coverArt && (
        <img
          src={track.coverArt}
          alt=""
          aria-hidden="true"
          className={`audio-player-direct-video-poster pointer-events-none absolute inset-0 size-full object-contain transition-opacity duration-200 motion-reduce:transition-none ${
            isLoading ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
      {isLoading && (
        <div
          role="status"
          aria-label={t('audioPlayer.videoLoading')}
          className="audio-player-direct-video-loading pointer-events-none absolute inset-0 grid place-items-center"
        >
          <span
            aria-hidden="true"
            className="size-12 animate-spin rounded-full border-4 border-white/40 border-t-white shadow-lg"
          />
        </div>
      )}
    </>
  )
}
