/**
  File: AudioPlayerProvider.tsx | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Own audio playback and expose shared media queue state to the app.
  - Mounted above the routes so playback and queued callbacks survive navigation.

  Usage:
  - Wrap the routed app in AudioPlayerProvider; read it with useAudioPlayer.

  Notes:
  - Starting media immediately replaces the current item; Add to queue preserves it.
  - A track's module callbacks remain attached while it waits in the queue.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { nextFastRate, nextSlowRate, NORMAL_RATE } from './playbackRates'
import { useAudioPlayerQueue } from './useAudioPlayerQueue'
import type { YouTubePlayerController } from './YouTubePlayer'
import {
  AudioPlayerContext,
  type MediaTrack,
  type QueuedAudioTrack,
} from './useAudioPlayer'

type AudioPlayerProviderProps = {
  children: ReactNode
}

export function AudioPlayerProvider({ children }: AudioPlayerProviderProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const videoPlayerRef = useRef<YouTubePlayerController | null>(null)
  const volumeRef = useRef(1)
  const currentItemRef = useRef<QueuedAudioTrack | null>(null)
  const hasStartedRef = useRef(false)
  const playbackAttemptRef = useRef(0)
  const [track, setTrack] = useState<MediaTrack | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isEnded, setIsEnded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isPanelOpen, setPanelOpen] = useState(false)
  const [isFullscreen, setFullscreen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [activePanelTab, setActivePanelTab] = useState<'player' | 'queue'>(
    'player',
  )
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playbackRate, setPlaybackRate] = useState(NORMAL_RATE)
  const [volume, setVolumeState] = useState(1)

  useEffect(() => {
    const audio = audioRef.current

    return () => audio?.pause()
  }, [])

  const startPlayback = useCallback((audio: HTMLAudioElement) => {
    const attempt = ++playbackAttemptRef.current

    void audio.play().catch(() => {
      if (attempt !== playbackAttemptRef.current) return

      setHasError(true)
      setIsPlaying(false)
    })
  }, [])

  const loadItem = useCallback(
    (item: QueuedAudioTrack, shouldPlay: boolean) => {
      const audio = audioRef.current

      if (!audio) return

      playbackAttemptRef.current += 1
      currentItemRef.current = item
      hasStartedRef.current = false
      setTrack(item.track)
      setCurrentTime(0)
      setDuration(0)
      setIsEnded(false)
      setHasError(false)
      setIsClosing(false)
      setActivePanelTab('player')
      audio.playbackRate = NORMAL_RATE
      audio.volume = volumeRef.current

      if (item.track.type === 'audio') {
        audio.src = item.track.src
        if (shouldPlay) startPlayback(audio)
      } else {
        audio.pause()
        audio.removeAttribute('src')
        audio.load()
      }
    },
    [startPlayback],
  )

  const onVideoPlayerReady = useCallback(
    (player: YouTubePlayerController | null) => {
      videoPlayerRef.current = player
      if (player) player.setVolume(Math.round(volumeRef.current * 100))
    },
    [],
  )

  const onVideoPlayingChange = useCallback((playing: boolean) => {
    setIsPlaying(playing)
    if (playing) {
      setIsEnded(false)
      setHasError(false)
      if (!hasStartedRef.current) {
        hasStartedRef.current = true
        currentItemRef.current?.callbacks.onStart?.()
      }
    }
  }, [])

  const onPlaybackError = useCallback(() => {
    setHasError(true)
    setIsPlaying(false)
  }, [])

  const {
    queue,
    clearQueue,
    playTrack,
    playNow,
    addToQueue,
    removeFromQueue,
    moveInQueue,
    takeNext,
  } = useAudioPlayerQueue({
    audioRef,
    currentItemRef,
    videoPlayerRef,
    isEnded,
    startPlayback,
    loadItem,
  })

  const stop = useCallback(() => {
    const audio = audioRef.current

    playbackAttemptRef.current += 1
    if (audio) {
      audio.pause()
      audio.removeAttribute('src')
      audio.load()
    }

    currentItemRef.current = null
    hasStartedRef.current = false
    clearQueue()
    setTrack(null)
    setIsPlaying(false)
    setIsEnded(false)
    setHasError(false)
    setIsClosing(false)
    setFullscreen(false)
    setActivePanelTab('player')
    setPanelOpen(false)
    setCurrentTime(0)
    setDuration(0)
    setPlaybackRate(NORMAL_RATE)
  }, [clearQueue])

  const advanceQueue = useCallback(() => {
    const next = takeNext()
    if (!next) return false

    loadItem(next, true)
    return true
  }, [loadItem, takeNext])

  const playNext = useCallback(() => {
    advanceQueue()
  }, [advanceQueue])

  const onMediaEnded = useCallback(() => {
    const currentItem = currentItemRef.current
    currentItem?.callbacks.onEnd?.()

    if (advanceQueue()) return

    if (currentItem?.track.type === 'youtube') {
      stop()
    } else {
      setIsPlaying(false)
      setIsEnded(true)
    }
  }, [advanceQueue, stop])

  const pausePlayback = useCallback(() => {
    const currentItem = currentItemRef.current
    if (!currentItem) return

    playbackAttemptRef.current += 1
    if (currentItem.track.type === 'youtube') {
      videoPlayerRef.current?.pauseVideo()
    } else {
      audioRef.current?.pause()
    }

    setIsPlaying(false)
    setHasError(false)
  }, [])

  const resumePlayback = useCallback(() => {
    const currentItem = currentItemRef.current
    if (!currentItem) return

    if (currentItem.track.type === 'youtube') {
      if (isEnded) videoPlayerRef.current?.seekTo(0, true)
      videoPlayerRef.current?.playVideo()
      return
    }

    const audio = audioRef.current
    if (!audio) return

    if (audio.ended) audio.currentTime = 0
    startPlayback(audio)
  }, [isEnded, startPlayback])

  const togglePlayback = useCallback(() => {
    const audio = audioRef.current
    if (!audio || !currentItemRef.current) return

    if (currentItemRef.current.track.type === 'youtube') {
      if (isPlaying) {
        videoPlayerRef.current?.pauseVideo()
      } else {
        if (isEnded) videoPlayerRef.current?.seekTo(0, true)
        videoPlayerRef.current?.playVideo()
      }
      return
    }

    if (audio.paused) {
      if (audio.ended) audio.currentTime = 0
      startPlayback(audio)
    } else {
      audio.pause()
    }
  }, [isEnded, isPlaying, startPlayback])

  const seek = useCallback((seconds: number) => {
    const audio = audioRef.current
    if (!audio || !Number.isFinite(seconds)) return

    audio.currentTime = Math.max(0, Math.min(seconds, audio.duration || 0))
    setCurrentTime(audio.currentTime)
  }, [])

  const setVolume = useCallback((nextVolume: number) => {
    const normalized = Math.max(0, Math.min(nextVolume, 1))
    volumeRef.current = normalized
    setVolumeState(normalized)
    if (audioRef.current) audioRef.current.volume = normalized
    videoPlayerRef.current?.setVolume(Math.round(normalized * 100))
  }, [])

  const speedUp = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = nextFastRate(
        audioRef.current.playbackRate,
      )
    }
  }, [])

  const slowDown = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = nextSlowRate(
        audioRef.current.playbackRate,
      )
    }
  }, [])

  const beginClose = useCallback(() => {
    setIsClosing(true)
    audioRef.current?.pause()
  }, [])

  const value = useMemo(
    () => ({
      track,
      isPlaying,
      isEnded,
      hasError,
      isPanelOpen,
      isFullscreen,
      isClosing,
      activePanelTab,
      currentTime,
      duration,
      playbackRate,
      volume,
      queue,
      onVideoPlayerReady,
      onVideoPlayingChange,
      onMediaEnded,
      onPlaybackError,
      playTrack,
      playNow,
      addToQueue,
      removeFromQueue,
      moveInQueue,
      playNext,
      pausePlayback,
      resumePlayback,
      togglePlayback,
      seek,
      setVolume,
      speedUp,
      slowDown,
      setPanelOpen,
      setFullscreen,
      setActivePanelTab,
      beginClose,
      stop,
    }),
    [
      addToQueue,
      activePanelTab,
      currentTime,
      duration,
      hasError,
      beginClose,
      isEnded,
      isClosing,
      isPanelOpen,
      isFullscreen,
      isPlaying,
      pausePlayback,
      playNow,
      playTrack,
      playbackRate,
      playNext,
      resumePlayback,
      queue,
      onVideoPlayerReady,
      onVideoPlayingChange,
      onMediaEnded,
      onPlaybackError,
      removeFromQueue,
      moveInQueue,
      seek,
      setVolume,
      setActivePanelTab,
      setPanelOpen,
      setFullscreen,
      slowDown,
      speedUp,
      stop,
      togglePlayback,
      track,
      volume,
    ],
  )

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        preload="metadata"
        onPlay={() => {
          setIsPlaying(true)
          setIsEnded(false)
        }}
        onPlaying={() => {
          setHasError(false)

          if (!hasStartedRef.current) {
            hasStartedRef.current = true
            currentItemRef.current?.callbacks.onStart?.()
          }
        }}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          onMediaEnded()
        }}
        onTimeUpdate={(event) =>
          setCurrentTime(event.currentTarget.currentTime)
        }
        onDurationChange={(event) =>
          setDuration(
            Number.isFinite(event.currentTarget.duration)
              ? event.currentTarget.duration
              : 0,
          )
        }
        onRateChange={(event) =>
          setPlaybackRate(event.currentTarget.playbackRate)
        }
        onError={() => {
          if (!currentItemRef.current) return

          setHasError(true)
          setIsPlaying(false)
        }}
      />
    </AudioPlayerContext.Provider>
  )
}
