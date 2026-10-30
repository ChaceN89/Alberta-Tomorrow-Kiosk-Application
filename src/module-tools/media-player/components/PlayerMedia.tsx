/**
  File: PlayerMedia.tsx | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Show the current track's video, or its cover art for audio.

  Usage:
  - Rendered at the top of the player view by AudioPlayerPanel.

  Notes:
  - YouTube playback reports state through the shared player context.
 */
import { useAudioPlayer } from '../hooks/useAudioPlayer'
import type { MediaTrack } from '../provider/types'
import { YouTubePlayer } from './YouTubePlayer'
import defaultAudioCover from '@/assets/default-audio-cover.svg'

type PlayerMediaProps = {
  track: MediaTrack
  isFullscreen: boolean
}

export function PlayerMedia({ track, isFullscreen }: PlayerMediaProps) {
  const {
    volume,
    onVideoPlayerReady,
    onVideoPlayingChange,
    onMediaEnded,
    onPlaybackError,
  } = useAudioPlayer()

  return (
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
          src={track.coverArt ?? defaultAudioCover}
          alt=""
          className="audio-player-media-content size-full object-contain"
        />
      )}
    </div>
  )
}
