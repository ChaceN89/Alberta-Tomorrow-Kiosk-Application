/**
  File: useAudioPlayerQueue.ts | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Own queued media state and the operations that add, reorder, and play queue items.

  Usage:
  - AudioPlayerProvider supplies playback refs and uses the returned queue actions.

  Notes:
  - The queue ref keeps consecutive playback actions in sync with rendered state.
 */
import { useCallback, useRef, useState } from 'react'
import type {
  AudioPlayCallbacks,
  MediaTrack,
  QueuedAudioTrack,
} from './useAudioPlayer'
import type { YouTubePlayerController } from './YouTubePlayer'

type RefLike<T> = {
  current: T
}

type UseAudioPlayerQueueOptions = {
  audioRef: RefLike<HTMLAudioElement | null>
  currentItemRef: RefLike<QueuedAudioTrack | null>
  videoPlayerRef: RefLike<YouTubePlayerController | null>
  isEnded: boolean
  startPlayback: (audio: HTMLAudioElement) => void
  loadItem: (item: QueuedAudioTrack, shouldPlay: boolean) => void
}

export function useAudioPlayerQueue({
  audioRef,
  currentItemRef,
  videoPlayerRef,
  isEnded,
  startPlayback,
  loadItem,
}: UseAudioPlayerQueueOptions) {
  const queueRef = useRef<QueuedAudioTrack[]>([])
  const queueIdRef = useRef(0)
  const [queue, setQueue] = useState<QueuedAudioTrack[]>([])

  const updateQueue = useCallback((next: QueuedAudioTrack[]) => {
    queueRef.current = next
    setQueue(next)
  }, [])

  const clearQueue = useCallback(() => updateQueue([]), [updateQueue])

  const playTrack = useCallback(
    (next: MediaTrack, callbacks: AudioPlayCallbacks = {}) => {
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
          if (next.type === 'youtube') {
            if (isEnded) videoPlayerRef.current?.seekTo(0, true)
            videoPlayerRef.current?.playVideo()
          } else {
            startPlayback(audio)
          }
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
    [
      audioRef,
      currentItemRef,
      isEnded,
      loadItem,
      startPlayback,
      updateQueue,
      videoPlayerRef,
    ],
  )

  const playNow = useCallback(
    (next: MediaTrack, callbacks: AudioPlayCallbacks = {}) => {
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
    (next: MediaTrack, callbacks: AudioPlayCallbacks = {}) => {
      if (currentItemRef.current?.track.id === next.id) return
      if (queueRef.current.some((item) => item.track.id === next.id)) return

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
    [currentItemRef, loadItem, updateQueue],
  )

  const removeFromQueue = useCallback(
    (queueId: number) => {
      updateQueue(queueRef.current.filter((item) => item.queueId !== queueId))
    },
    [updateQueue],
  )

  const moveInQueue = useCallback(
    (queueId: number, direction: 'up' | 'down') => {
      const currentQueue = queueRef.current
      const index = currentQueue.findIndex((item) => item.queueId === queueId)
      const nextIndex = index + (direction === 'up' ? -1 : 1)

      if (index === -1 || nextIndex < 0 || nextIndex >= currentQueue.length) {
        return
      }

      const reordered = [...currentQueue]
      ;[reordered[index], reordered[nextIndex]] = [
        reordered[nextIndex],
        reordered[index],
      ]
      updateQueue(reordered)
    },
    [updateQueue],
  )

  const takeNext = useCallback(() => {
    const [next, ...remaining] = queueRef.current
    if (!next) return null

    updateQueue(remaining)
    return next
  }, [updateQueue])

  return {
    queue,
    clearQueue,
    playTrack,
    playNow,
    addToQueue,
    removeFromQueue,
    moveInQueue,
    takeNext,
  }
}
