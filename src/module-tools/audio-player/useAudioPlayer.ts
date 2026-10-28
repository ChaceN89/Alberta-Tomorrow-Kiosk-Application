/**
  File: useAudioPlayer.ts | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Define the audio player context, track and callback types, and the consumer hook.
  - Modules call playTrack with plain track data and optional start/end callbacks.

  Usage:
  - Modules and module tools call useAudioPlayer; AudioPlayerProvider supplies the value.

  Notes:
  - onStart and onEnd are registered per playTrack call, so they still fire after the
    learner leaves the page that started the audio. Finishing includes seeking or
    speeding through to the end.
 */
import { createContext, useContext } from 'react'

export type AudioTrack = {
  id: string
  src: string
  title: string
  subtitle?: string
  coverArt: string
}

export type AudioPlayCallbacks = {
  onStart?: () => void
  onEnd?: () => void
}

export type QueuedAudioTrack = {
  queueId: number
  track: AudioTrack
  callbacks: AudioPlayCallbacks
}

type AudioPlayerContextValue = {
  // null means nothing is loaded and the player is fully turned off.
  track: AudioTrack | null
  isPlaying: boolean
  isEnded: boolean
  hasError: boolean
  isPanelOpen: boolean
  isClosing: boolean
  activePanelTab: 'player' | 'queue'
  currentTime: number
  duration: number
  playbackRate: number
  volume: number
  queue: readonly QueuedAudioTrack[]
  playTrack: (track: AudioTrack, callbacks?: AudioPlayCallbacks) => void
  playNow: (track: AudioTrack, callbacks?: AudioPlayCallbacks) => void
  addToQueue: (track: AudioTrack, callbacks?: AudioPlayCallbacks) => void
  removeFromQueue: (queueId: number) => void
  moveInQueue: (queueId: number, direction: 'up' | 'down') => void
  playNext: () => void
  togglePlayback: () => void
  seek: (seconds: number) => void
  setVolume: (volume: number) => void
  speedUp: () => void
  slowDown: () => void
  setPanelOpen: (isOpen: boolean) => void
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
