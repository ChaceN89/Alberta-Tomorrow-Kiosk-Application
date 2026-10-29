/**
  File: AudioPlayerContext.ts | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Define the value shared by the media player provider with its consumers.

  Usage:
  - Imported by AudioPlayerProvider and useAudioPlayer.

  Notes:
  - Consumers should use the useAudioPlayer hook instead of this context.
 */
import { createContext } from 'react'
import type {
  AudioPlayCallbacks,
  MediaTrack,
  QueuedAudioTrack,
  YouTubePlayerController,
} from './types'

type AudioPlayerContextValue = {
  // null means nothing is loaded and the player is fully turned off.
  track: MediaTrack | null
  isPlaying: boolean
  isEnded: boolean
  hasError: boolean
  isPanelOpen: boolean
  isFullscreen: boolean
  isClosing: boolean
  isMediaEndClosing: boolean
  activePanelTab: 'player' | 'queue'
  currentTime: number
  duration: number
  playbackRate: number
  volume: number
  queue: readonly QueuedAudioTrack[]
  onVideoPlayerReady: (player: YouTubePlayerController | null) => void
  onVideoPlayingChange: (isPlaying: boolean) => void
  onMediaEnded: () => void
  onPlaybackError: () => void
  playTrack: (track: MediaTrack, callbacks?: AudioPlayCallbacks) => void
  playNow: (track: MediaTrack, callbacks?: AudioPlayCallbacks) => void
  addToQueue: (track: MediaTrack, callbacks?: AudioPlayCallbacks) => void
  removeFromQueue: (queueId: number) => void
  moveInQueue: (queueId: number, direction: 'up' | 'down') => void
  playNext: () => void
  pausePlayback: () => void
  resumePlayback: () => void
  togglePlayback: () => void
  seek: (seconds: number) => void
  setVolume: (volume: number) => void
  speedUp: () => void
  slowDown: () => void
  setPanelOpen: (isOpen: boolean) => void
  setFullscreen: (isFullscreen: boolean) => void
  setActivePanelTab: (tab: 'player' | 'queue') => void
  beginClose: () => void
  // Unloads the track and hides the player completely.
  stop: () => void
}

export const AudioPlayerContext = createContext<AudioPlayerContextValue | null>(
  null,
)
