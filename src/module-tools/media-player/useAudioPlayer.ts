/**
  File: useAudioPlayer.ts | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Define the shared media player context, track types, callbacks, and consumer hook.
  - Modules call playTrack with typed media data and optional start/end callbacks.

  Usage:
  - Modules and module tools call useAudioPlayer; AudioPlayerProvider supplies the value.

  Notes:
  - onStart and onEnd are registered per playTrack call, so they still fire after the
    learner leaves the page that started the audio. Finishing includes seeking or
    speeding through to the end.
 */
import { createContext, useContext } from 'react'
import type { YouTubePlayerController } from './YouTubePlayer'

type MediaItemBase = {
  id: string
  title: string
  subtitle?: string
  coverArt: string
  translation?: {
    namespace: 'geology' | 'wildlifeFinder'
    titleKey: string
    subtitleKey?: string
  }
}

export type AudioTrack = MediaItemBase & {
  type: 'audio'
  src: string
}

export type YouTubeTrack = MediaItemBase & {
  type: 'youtube'
  videoId: string
}

export type MediaTrack = AudioTrack | YouTubeTrack

export type AudioPlayCallbacks = {
  onStart?: () => void
  onEnd?: () => void
}

export type QueuedAudioTrack = {
  queueId: number
  track: MediaTrack
  callbacks: AudioPlayCallbacks
}

type AudioPlayerContextValue = {
  // null means nothing is loaded and the player is fully turned off.
  track: MediaTrack | null
  isPlaying: boolean
  isEnded: boolean
  hasError: boolean
  isPanelOpen: boolean
  isFullscreen: boolean
  isClosing: boolean
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

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext)

  if (!context) {
    throw new Error(
      'useAudioPlayer must be used within an AudioPlayerProvider.',
    )
  }

  return context
}
