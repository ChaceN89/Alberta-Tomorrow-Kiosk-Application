/**
  File: usePlayerClose.ts | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Run the player's close flow: confirmation, exit animation, then unloading the track.

  Usage:
  - Called by AudioPlayerPanel, which applies the returned animation classes.

  Notes:
  - A player with queued items asks first. Media that ends on its own closes itself
    after the same animations.
  - Timings must match the exit animations in AudioPlayer.css.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import { useAudioPlayer } from './useAudioPlayer'

const FULLSCREEN_EXIT_DURATION_MS = 320
const COMPACT_EXIT_DURATION_MS = 300
const MEDIA_END_CLOSE_DELAY_MS = 700

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function usePlayerClose() {
  const {
    track,
    queue,
    isPanelOpen,
    isFullscreen,
    isMediaEndClosing,
    setFullscreen,
    beginClose,
    stop,
  } = useAudioPlayer()
  const [isConfirmingClose, setConfirmingClose] = useState(false)
  const [isAnimatingClose, setAnimatingClose] = useState(false)
  const [isAnimatingFullscreenExit, setAnimatingFullscreenExit] =
    useState(false)
  const closeAnimationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  )
  const currentTrackIdRef = useRef(track?.id ?? null)

  useEffect(() => {
    currentTrackIdRef.current = track?.id ?? null
  }, [track?.id])

  useEffect(
    () => () => {
      if (closeAnimationTimeoutRef.current) {
        clearTimeout(closeAnimationTimeoutRef.current)
      }
    },
    [],
  )

  useEffect(() => {
    if (!isMediaEndClosing) return

    const delay = isFullscreen ? MEDIA_END_CLOSE_DELAY_MS : 0
    const duration = prefersReducedMotion()
      ? 0
      : isFullscreen
        ? FULLSCREEN_EXIT_DURATION_MS
        : COMPACT_EXIT_DURATION_MS
    const timeoutId = window.setTimeout(stop, delay + duration)

    return () => window.clearTimeout(timeoutId)
  }, [isFullscreen, isMediaEndClosing, stop])

  const cancelClose = useCallback(() => setConfirmingClose(false), [])

  const closePlayer = () => {
    setConfirmingClose(false)
    const closingTrackId = track?.id ?? null

    beginClose()

    const finish = (clearAnimation: () => void, duration: number) => {
      closeAnimationTimeoutRef.current = setTimeout(() => {
        closeAnimationTimeoutRef.current = null
        if (currentTrackIdRef.current === closingTrackId) {
          stop()
        }
        clearAnimation()
      }, duration)
    }

    if (isFullscreen) {
      setAnimatingFullscreenExit(true)
      finish(
        () => setAnimatingFullscreenExit(false),
        prefersReducedMotion() ? 0 : FULLSCREEN_EXIT_DURATION_MS,
      )
      return
    }

    setAnimatingClose(true)
    setFullscreen(false)
    finish(() => setAnimatingClose(false), COMPACT_EXIT_DURATION_MS)
  }

  const requestClose = () => {
    if (queue.length > 0) {
      setConfirmingClose(true)
    } else {
      closePlayer()
    }
  }

  const isMediaEndFullscreenExit = isMediaEndClosing && isFullscreen
  const isCompactCloseAnimation = isAnimatingClose || isMediaEndClosing
  const isFullscreenCloseAnimation =
    isAnimatingFullscreenExit || isMediaEndFullscreenExit
  const stageExitAnimationClass = isFullscreenCloseAnimation
    ? `audio-player-stage--fullscreen-exit ${
        isMediaEndFullscreenExit ? 'audio-player-stage--media-end-exit' : ''
      }`
    : isCompactCloseAnimation && isPanelOpen
      ? 'audio-panel-exit'
      : ''
  const frameExitAnimationClass = isFullscreenCloseAnimation
    ? `audio-player-frame--fullscreen-exit ${
        isMediaEndFullscreenExit ? 'audio-player-frame--media-end-exit' : ''
      }`
    : isCompactCloseAnimation
      ? isPanelOpen
        ? 'audio-panel-exit'
        : 'audio-panel-exit--collapsed'
      : ''

  return {
    isConfirmingClose,
    cancelClose,
    closePlayer,
    requestClose,
    stageExitAnimationClass,
    frameExitAnimationClass,
  }
}
