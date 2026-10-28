/**
  File: AudioPlayerProvider.tsx | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Own the single audio element and expose playback, volume, and queue state to the app.
  - Mounted above the routes so audio and queued callbacks survive client-side navigation.

  Usage:
  - Wrap the routed app in AudioPlayerProvider; read it with useAudioPlayer.

  Notes:
  - Starting a track immediately replaces the current track; Add to queue preserves it.
  - A track's module callbacks remain attached while it waits in the queue.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { nextFastRate, nextSlowRate, NORMAL_RATE } from './playbackRates'
import {
  AudioPlayerContext,
  type AudioPlayCallbacks,
  type AudioTrack,
  type QueuedAudioTrack,
} from './useAudioPlayer'

type AudioPlayerProviderProps = {
  children: ReactNode
}

export function AudioPlayerProvider({ children }: AudioPlayerProviderProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const currentItemRef = useRef<QueuedAudioTrack | null>(null)
  const queueRef = useRef<QueuedAudioTrack[]>([])
  const queueIdRef = useRef(0)
  const hasStartedRef = useRef(false)
  const [track, setTrack] = useState<AudioTrack | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isEnded, setIsEnded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isPanelOpen, setPanelOpen] = useState(false)
  const [activePanelTab, setActivePanelTab] = useState<'player' | 'queue'>(
    'player',
  )
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playbackRate, setPlaybackRate] = useState(NORMAL_RATE)
  const [volume, setVolumeState] = useState(1)
  const [queue, setQueue] = useState<QueuedAudioTrack[]>([])

  useEffect(() => {
    const audio = audioRef.current

    return () => audio?.pause()
  }, [])

  const startPlayback = useCallback((audio: HTMLAudioElement) => {
    void audio.play().catch(() => {
      setHasError(true)
      setIsPlaying(false)
    })
  }, [])

  const loadItem = useCallback(
    (item: QueuedAudioTrack, shouldPlay: boolean) => {
      const audio = audioRef.current

      if (!audio) return

      currentItemRef.current = item
      hasStartedRef.current = false
      setTrack(item.track)
      setCurrentTime(0)
      setDuration(0)
      setIsEnded(false)
      setHasError(false)
      setActivePanelTab('player')
      setPanelOpen(true)
      audio.src = item.track.src
      audio.playbackRate = NORMAL_RATE
      audio.volume = volume

      if (shouldPlay) startPlayback(audio)
    },
    [startPlayback, volume],
  )

  const updateQueue = useCallback((next: QueuedAudioTrack[]) => {
    queueRef.current = next
    setQueue(next)
  }, [])

  const playTrack = useCallback(
    (next: AudioTrack, callbacks: AudioPlayCallbacks = {}) => {
      const audio = audioRef.current
      if (!audio) return

      const current = currentItemRef.current

      if (current?.track.id === next.id) {
        if (audio.ended) {
          loadItem(
            {
              queueId: current.queueId,
              track: next,
              callbacks: current.callbacks,
            },
            true,
          )
        } else if (audio.paused) {
          startPlayback(audio)
        }
        return
      }

      const queuedIndex = queueRef.current.findIndex(
        (item) => item.track.id === next.id,
      )
      if (queuedIndex !== -1) {
        const [item] = queueRef.current.splice(queuedIndex, 1)
        updateQueue([...queueRef.current])
        loadItem(item, true)
        return
      }

      loadItem({ queueId: ++queueIdRef.current, track: next, callbacks }, true)
    },
    [loadItem, startPlayback, updateQueue],
  )

  const playNow = useCallback(
    (next: AudioTrack, callbacks: AudioPlayCallbacks = {}) => {
      const existingIndex = queueRef.current.findIndex(
        (item) => item.track.id === next.id,
      )
      const existing =
        existingIndex === -1 ? undefined : queueRef.current[existingIndex]

      if (existingIndex !== -1) {
        updateQueue(
          queueRef.current.filter((_, index) => index !== existingIndex),
        )
      }

      loadItem(
        existing ?? {
          queueId: ++queueIdRef.current,
          track: next,
          callbacks,
        },
        true,
      )
    },
    [loadItem, updateQueue],
  )

  const addToQueue = useCallback(
    (next: AudioTrack, callbacks: AudioPlayCallbacks = {}) => {
      const item = {
        queueId: ++queueIdRef.current,
        track: next,
        callbacks,
      }

      if (!currentItemRef.current) {
        loadItem(item, true)
        return
      }

      updateQueue([...queueRef.current, item])
    },
    [loadItem, updateQueue],
  )

  const removeFromQueue = useCallback(
    (queueId: number) => {
      updateQueue(queueRef.current.filter((item) => item.queueId !== queueId))
    },
    [updateQueue],
  )

  const playNext = useCallback(() => {
    const [next, ...remaining] = queueRef.current
    if (!next) return

    updateQueue(remaining)
    loadItem(next, true)
  }, [loadItem, updateQueue])

  const togglePlayback = useCallback(() => {
    const audio = audioRef.current
    if (!audio || !currentItemRef.current) return

    if (audio.paused) {
      if (audio.ended) audio.currentTime = 0
      startPlayback(audio)
    } else {
      audio.pause()
    }
  }, [startPlayback])

  const seek = useCallback((seconds: number) => {
    const audio = audioRef.current
    if (!audio || !Number.isFinite(seconds)) return

    audio.currentTime = Math.max(0, Math.min(seconds, audio.duration || 0))
    setCurrentTime(audio.currentTime)
  }, [])

  const setVolume = useCallback((nextVolume: number) => {
    const normalized = Math.max(0, Math.min(nextVolume, 1))
    setVolumeState(normalized)
    if (audioRef.current) audioRef.current.volume = normalized
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

  const stop = useCallback(() => {
    const audio = audioRef.current

    if (audio) {
      audio.pause()
      audio.removeAttribute('src')
      audio.load()
    }

    currentItemRef.current = null
    hasStartedRef.current = false
    updateQueue([])
    setTrack(null)
    setIsPlaying(false)
    setIsEnded(false)
    setHasError(false)
    setActivePanelTab('player')
    setPanelOpen(false)
    setCurrentTime(0)
    setDuration(0)
    setPlaybackRate(NORMAL_RATE)
  }, [updateQueue])

  const value = useMemo(
    () => ({
      track,
      isPlaying,
      isEnded,
      hasError,
      isPanelOpen,
      activePanelTab,
      currentTime,
      duration,
      playbackRate,
      volume,
      queue,
      playTrack,
      playNow,
      addToQueue,
      removeFromQueue,
      playNext,
      togglePlayback,
      seek,
      setVolume,
      speedUp,
      slowDown,
      setPanelOpen,
      setActivePanelTab,
      stop,
    }),
    [
      addToQueue,
      activePanelTab,
      currentTime,
      duration,
      hasError,
      isEnded,
      isPanelOpen,
      isPlaying,
      playNow,
      playTrack,
      playbackRate,
      playNext,
      queue,
      removeFromQueue,
      seek,
      setVolume,
      setActivePanelTab,
      setPanelOpen,
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
          currentItemRef.current?.callbacks.onEnd?.()

          const [next, ...remaining] = queueRef.current
          if (next) {
            updateQueue(remaining)
            loadItem(next, true)
          } else {
            setIsPlaying(false)
            setIsEnded(true)
          }
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
