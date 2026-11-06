/**
  File: AudioPlayerProvider.tsx | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Own audio and video playback and expose shared media queue state to the app.
  - Mounted above the routes so playback and queued callbacks survive navigation.

  Usage:
  - Wrap the routed app in AudioPlayerProvider; read it with useAudioPlayer.

  Notes:
  - Starting media immediately replaces the current item; Add to queue preserves it.
  - A track's module callbacks remain attached while it waits in the queue.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { nextFastRate, nextSlowRate, NORMAL_RATE } from '../utils/playbackRates'
import { useAudioPlayerQueue } from '../hooks/useAudioPlayerQueue'
import { AudioPlayerContext } from './AudioPlayerContext'
import type {
  MediaTrack,
  QueuedAudioTrack,
  YouTubePlayerController,
} from './types'

const FULLSCREEN_ENTRY_DURATION_MS = 320
const PLAYER_MORPH_DURATION_MS = 1200
const VIDEO_START_BUFFER_MS = 100

type AudioPlayerProviderProps = {
  children: ReactNode
}

export function AudioPlayerProvider({ children }: AudioPlayerProviderProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const videoPlayerRef = useRef<YouTubePlayerController | null>(null)
  const directVideoRef = useRef<HTMLVideoElement | null>(null)
  const shouldStartYouTubeRef = useRef(false)
  const shouldStartDirectVideoRef = useRef(false)
  const videoStartDelayElapsedRef = useRef(true)
  const fullscreenEntryPendingRef = useRef(false)
  const fullscreenStartTimeoutRef = useRef<number | null>(null)
  const isPanelOpenRef = useRef(false)
  const isFullscreenRef = useRef(false)
  const isMediaEndClosingRef = useRef(false)
  const volumeRef = useRef(1)
  const currentItemRef = useRef<QueuedAudioTrack | null>(null)
  const hasStartedRef = useRef(false)
  const playbackAttemptRef = useRef(0)
  const [track, setTrack] = useState<MediaTrack | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [collapsedPlaybackStartSequence, setCollapsedPlaybackStartSequence] =
    useState(0)
  const [isEnded, setIsEnded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isPanelOpen, setPanelOpenState] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [isMediaEndClosing, setIsMediaEndClosing] = useState(false)
  const [activePanelTab, setActivePanelTab] = useState<'player' | 'queue'>(
    'player',
  )
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playbackRate, setPlaybackRate] = useState(NORMAL_RATE)
  const [volume, setVolumeState] = useState(1)

  const setPanelOpen = useCallback((isOpen: boolean) => {
    isPanelOpenRef.current = isOpen
    setPanelOpenState(isOpen)
    if (isOpen) setCollapsedPlaybackStartSequence(0)
  }, [])

  const onCollapsedPlaybackStarted = useCallback(() => {
    if (!isPanelOpenRef.current && !isFullscreenRef.current) {
      setCollapsedPlaybackStartSequence((sequence) => sequence + 1)
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current

    return () => {
      audio?.pause()
      if (fullscreenStartTimeoutRef.current !== null) {
        window.clearTimeout(fullscreenStartTimeoutRef.current)
      }
    }
  }, [])

  const startPlayback = useCallback((audio: HTMLAudioElement) => {
    const attempt = ++playbackAttemptRef.current

    void audio.play().catch(() => {
      if (attempt !== playbackAttemptRef.current) return

      setHasError(true)
      setIsPlaying(false)
    })
  }, [])

  const startDirectVideoPlayback = useCallback((video: HTMLVideoElement) => {
    shouldStartDirectVideoRef.current = true
    if (!videoStartDelayElapsedRef.current) return

    const attempt = ++playbackAttemptRef.current

    void video.play().catch(() => {
      if (attempt !== playbackAttemptRef.current) return

      setHasError(true)
      setIsPlaying(false)
    })
  }, [])

  const startYouTubePlayback = useCallback(() => {
    shouldStartYouTubeRef.current = true
    if (!videoStartDelayElapsedRef.current) return

    videoPlayerRef.current?.playVideo()
  }, [])

  const startPendingVideoPlayback = useCallback(() => {
    const currentTrack = currentItemRef.current?.track

    if (currentTrack?.type === 'youtube' && shouldStartYouTubeRef.current) {
      startYouTubePlayback()
    } else if (
      currentTrack?.type === 'video' &&
      shouldStartDirectVideoRef.current &&
      directVideoRef.current
    ) {
      startDirectVideoPlayback(directVideoRef.current)
    }
  }, [startDirectVideoPlayback, startYouTubePlayback])

  const setFullscreen = useCallback(
    (fullscreen: boolean) => {
      const wasFullscreen = isFullscreenRef.current
      isFullscreenRef.current = fullscreen
      setIsFullscreen(fullscreen)

      if (fullscreen && !wasFullscreen) {
        setCollapsedPlaybackStartSequence(0)
        fullscreenEntryPendingRef.current = true
        videoStartDelayElapsedRef.current = false
        if (fullscreenStartTimeoutRef.current !== null) {
          window.clearTimeout(fullscreenStartTimeoutRef.current)
        }

        const prefersReducedMotion = window.matchMedia(
          '(prefers-reduced-motion: reduce)',
        ).matches
        const animationDuration = currentItemRef.current
          ? PLAYER_MORPH_DURATION_MS
          : FULLSCREEN_ENTRY_DURATION_MS
        const delay =
          (prefersReducedMotion ? 0 : animationDuration) + VIDEO_START_BUFFER_MS

        fullscreenStartTimeoutRef.current = window.setTimeout(() => {
          fullscreenStartTimeoutRef.current = null
          fullscreenEntryPendingRef.current = false
          videoStartDelayElapsedRef.current = true
          startPendingVideoPlayback()
        }, delay)
      } else if (!fullscreen) {
        const wasEntryPending = fullscreenEntryPendingRef.current
        if (fullscreenStartTimeoutRef.current !== null) {
          window.clearTimeout(fullscreenStartTimeoutRef.current)
          fullscreenStartTimeoutRef.current = null
        }
        fullscreenEntryPendingRef.current = false
        videoStartDelayElapsedRef.current = true
        if (wasEntryPending) startPendingVideoPlayback()
      }
    },
    [startPendingVideoPlayback],
  )

  const loadItem = useCallback(
    (item: QueuedAudioTrack, shouldPlay: boolean) => {
      const audio = audioRef.current

      if (!audio) return

      playbackAttemptRef.current += 1
      shouldStartYouTubeRef.current =
        item.track.type === 'youtube' && shouldPlay
      shouldStartDirectVideoRef.current =
        item.track.type === 'video' && shouldPlay
      currentItemRef.current = item
      hasStartedRef.current = false
      setTrack(item.track)
      setCurrentTime(0)
      setDuration(0)
      setIsEnded(false)
      setHasError(false)
      setIsClosing(false)
      isMediaEndClosingRef.current = false
      setIsMediaEndClosing(false)
      setActivePanelTab('player')
      audio.playbackRate = NORMAL_RATE
      audio.volume = volumeRef.current
      videoPlayerRef.current?.pauseVideo()
      directVideoRef.current?.pause()

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
      if (player) {
        player.setVolume(Math.round(volumeRef.current * 100))
        if (
          shouldStartYouTubeRef.current &&
          videoStartDelayElapsedRef.current
        ) {
          startYouTubePlayback()
        }
      }
    },
    [startYouTubePlayback],
  )

  const onVideoPlayingChange = useCallback(
    (playing: boolean) => {
      setIsPlaying(playing)
      if (playing) {
        setIsEnded(false)
        setHasError(false)
        onCollapsedPlaybackStarted()
        if (!hasStartedRef.current) {
          hasStartedRef.current = true
          currentItemRef.current?.callbacks.onStart?.()
        }
      }
    },
    [onCollapsedPlaybackStarted],
  )

  const registerDirectVideoElement = useCallback(
    (video: HTMLVideoElement | null) => {
      directVideoRef.current = video
      if (!video) return

      video.volume = volumeRef.current
      video.playbackRate = NORMAL_RATE
      if (
        currentItemRef.current?.track.type === 'video' &&
        shouldStartDirectVideoRef.current &&
        videoStartDelayElapsedRef.current
      ) {
        startDirectVideoPlayback(video)
      }
    },
    [startDirectVideoPlayback],
  )

  const onDirectVideoTimeUpdate = useCallback((time: number) => {
    setCurrentTime(time)
  }, [])

  const onDirectVideoDurationChange = useCallback((nextDuration: number) => {
    setDuration(nextDuration)
  }, [])

  const onDirectVideoPlaybackRateChange = useCallback((rate: number) => {
    setPlaybackRate(rate)
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
    directVideoRef,
    currentItemRef,
    videoPlayerRef,
    isEnded,
    startPlayback,
    startDirectVideoPlayback,
    startYouTubePlayback,
    loadItem,
  })

  const stop = useCallback(() => {
    const audio = audioRef.current

    playbackAttemptRef.current += 1
    if (fullscreenStartTimeoutRef.current !== null) {
      window.clearTimeout(fullscreenStartTimeoutRef.current)
      fullscreenStartTimeoutRef.current = null
    }
    shouldStartYouTubeRef.current = false
    shouldStartDirectVideoRef.current = false
    fullscreenEntryPendingRef.current = false
    videoStartDelayElapsedRef.current = true
    directVideoRef.current?.pause()
    if (audio) {
      audio.pause()
      audio.removeAttribute('src')
      audio.load()
    }

    currentItemRef.current = null
    hasStartedRef.current = false
    clearQueue()
    setCollapsedPlaybackStartSequence(0)
    setTrack(null)
    setIsPlaying(false)
    setIsEnded(false)
    setHasError(false)
    setIsClosing(false)
    isMediaEndClosingRef.current = false
    setIsMediaEndClosing(false)
    setFullscreen(false)
    setActivePanelTab('player')
    setPanelOpen(false)
    setCurrentTime(0)
    setDuration(0)
    setPlaybackRate(NORMAL_RATE)
  }, [clearQueue, setFullscreen, setPanelOpen])

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
    if (isMediaEndClosingRef.current) return

    const currentItem = currentItemRef.current
    if (!currentItem) return

    currentItem.callbacks.onEnd?.()

    if (advanceQueue()) return

    if (currentItem.track.type !== 'audio' && !isFullscreenRef.current) {
      stop()
    } else {
      isMediaEndClosingRef.current = true
      setIsMediaEndClosing(true)
      setIsClosing(true)
    }
  }, [advanceQueue, stop])

  const pausePlayback = useCallback(() => {
    const currentItem = currentItemRef.current
    if (!currentItem) return

    playbackAttemptRef.current += 1
    if (currentItem.track.type === 'youtube') {
      shouldStartYouTubeRef.current = false
      videoPlayerRef.current?.pauseVideo()
    } else if (currentItem.track.type === 'video') {
      shouldStartDirectVideoRef.current = false
      directVideoRef.current?.pause()
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
      startYouTubePlayback()
      return
    }

    if (currentItem.track.type === 'video') {
      const video = directVideoRef.current
      if (!video) return

      if (video.ended) video.currentTime = 0
      startDirectVideoPlayback(video)
      return
    }

    const audio = audioRef.current
    if (!audio) return

    if (audio.ended) audio.currentTime = 0
    startPlayback(audio)
  }, [isEnded, startDirectVideoPlayback, startPlayback, startYouTubePlayback])

  const togglePlayback = useCallback(() => {
    const currentItem = currentItemRef.current
    if (!currentItem) return

    if (currentItem.track.type === 'youtube') {
      if (isPlaying) {
        shouldStartYouTubeRef.current = false
        videoPlayerRef.current?.pauseVideo()
      } else {
        if (isEnded) videoPlayerRef.current?.seekTo(0, true)
        startYouTubePlayback()
      }
      return
    }

    if (currentItem.track.type === 'video') {
      const video = directVideoRef.current
      if (!video) return

      if (video.paused) {
        if (video.ended) video.currentTime = 0
        startDirectVideoPlayback(video)
      } else {
        shouldStartDirectVideoRef.current = false
        video.pause()
      }
      return
    }

    const audio = audioRef.current
    if (!audio) return

    if (audio.paused) {
      if (audio.ended) audio.currentTime = 0
      startPlayback(audio)
    } else {
      audio.pause()
    }
  }, [
    isEnded,
    isPlaying,
    startDirectVideoPlayback,
    startPlayback,
    startYouTubePlayback,
  ])

  const seek = useCallback((seconds: number) => {
    if (!Number.isFinite(seconds)) return

    if (currentItemRef.current?.track.type === 'video') {
      const video = directVideoRef.current
      if (!video) return

      video.currentTime = Math.max(
        0,
        Math.min(seconds, Number.isFinite(video.duration) ? video.duration : 0),
      )
      setCurrentTime(video.currentTime)
      return
    }

    const audio = audioRef.current
    if (!audio) return

    audio.currentTime = Math.max(
      0,
      Math.min(seconds, Number.isFinite(audio.duration) ? audio.duration : 0),
    )
    setCurrentTime(audio.currentTime)
  }, [])

  const setVolume = useCallback((nextVolume: number) => {
    const normalized = Math.max(0, Math.min(nextVolume, 1))
    volumeRef.current = normalized
    setVolumeState(normalized)
    if (audioRef.current) audioRef.current.volume = normalized
    if (directVideoRef.current) directVideoRef.current.volume = normalized
    videoPlayerRef.current?.setVolume(Math.round(normalized * 100))
  }, [])

  const speedUp = useCallback(() => {
    if (currentItemRef.current?.track.type === 'video') {
      if (directVideoRef.current) {
        directVideoRef.current.playbackRate = nextFastRate(
          directVideoRef.current.playbackRate,
        )
      }
    } else if (audioRef.current) {
      audioRef.current.playbackRate = nextFastRate(
        audioRef.current.playbackRate,
      )
    }
  }, [])

  const slowDown = useCallback(() => {
    if (currentItemRef.current?.track.type === 'video') {
      if (directVideoRef.current) {
        directVideoRef.current.playbackRate = nextSlowRate(
          directVideoRef.current.playbackRate,
        )
      }
    } else if (audioRef.current) {
      audioRef.current.playbackRate = nextSlowRate(
        audioRef.current.playbackRate,
      )
    }
  }, [])

  const beginClose = useCallback(() => {
    setIsClosing(true)
    if (currentItemRef.current?.track.type === 'youtube') {
      shouldStartYouTubeRef.current = false
      videoPlayerRef.current?.pauseVideo()
    } else if (currentItemRef.current?.track.type === 'video') {
      shouldStartDirectVideoRef.current = false
      directVideoRef.current?.pause()
    } else {
      audioRef.current?.pause()
    }
  }, [])

  const value = useMemo(
    () => ({
      track,
      isPlaying,
      collapsedPlaybackStartSequence,
      isEnded,
      hasError,
      isPanelOpen,
      isFullscreen,
      isClosing,
      isMediaEndClosing,
      activePanelTab,
      currentTime,
      duration,
      playbackRate,
      volume,
      queue,
      onVideoPlayerReady,
      onVideoPlayingChange,
      registerDirectVideoElement,
      onDirectVideoTimeUpdate,
      onDirectVideoDurationChange,
      onDirectVideoPlaybackRateChange,
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
      isMediaEndClosing,
      isPlaying,
      collapsedPlaybackStartSequence,
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
      onDirectVideoDurationChange,
      onDirectVideoPlaybackRateChange,
      onDirectVideoTimeUpdate,
      registerDirectVideoElement,
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
          onCollapsedPlaybackStarted()

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
