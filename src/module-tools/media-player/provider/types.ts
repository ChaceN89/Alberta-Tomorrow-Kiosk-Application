/**
  File: types.ts | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Define the media track, queue, and YouTube controller types shared by the player.

  Usage:
  - Imported by modules that describe tracks and by the player's provider and components.

  Notes:
  - onStart and onEnd are registered per playTrack call, so they still fire after the
    learner leaves the page that started the audio. Finishing includes seeking or
    speeding through to the end.
 */
export type YouTubePlayerController = {
  playVideo: () => void
  pauseVideo: () => void
  seekTo: (seconds: number, allowSeekAhead: boolean) => void
  setVolume: (volume: number) => void
  getIframe: () => HTMLIFrameElement
  destroy: () => void
}

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
