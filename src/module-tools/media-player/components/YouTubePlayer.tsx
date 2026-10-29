/**
  File: YouTubePlayer.tsx | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Load YouTube's iframe API and render a controllable embedded video player.

  Usage:
  - Render for the active YouTube media item in the shared media player.

  Notes:
  - The iframe's native controls provide seeking, volume, captions, and full-screen playback.
 */
import { useEffect, useRef } from 'react'
import type { YouTubePlayerController } from '../provider/types'

type YouTubeIframeApi = {
  Player: new (
    element: HTMLElement,
    options: {
      videoId: string
      playerVars: {
        autoplay: 1
        controls: 1
        fs: 1
        playsinline: 1
        rel: 0
      }
      events: {
        onReady: (event: { target: YouTubePlayerController }) => void
        onStateChange: (event: { data: number }) => void
        onError: () => void
      }
    },
  ) => YouTubePlayerController
}

declare global {
  interface Window {
    YT?: YouTubeIframeApi
    onYouTubeIframeAPIReady?: () => void
  }
}

let youtubeApiPromise: Promise<YouTubeIframeApi> | null = null

function loadYouTubeIframeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT)
  if (youtubeApiPromise) return youtubeApiPromise

  youtubeApiPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://www.youtube.com/iframe_api'
    script.async = true
    script.onerror = () => {
      youtubeApiPromise = null
      reject(new Error('The YouTube player API could not be loaded.'))
    }
    window.onYouTubeIframeAPIReady = () => {
      if (window.YT?.Player) {
        resolve(window.YT)
      } else {
        youtubeApiPromise = null
        reject(new Error('The YouTube player API did not initialize.'))
      }
    }
    document.head.append(script)
  })

  return youtubeApiPromise
}

type YouTubePlayerProps = {
  videoId: string
  title: string
  volume: number
  onReady: (player: YouTubePlayerController | null) => void
  onPlayingChange: (isPlaying: boolean) => void
  onEnded: () => void
  onError: () => void
}

export function YouTubePlayer({
  videoId,
  title,
  volume,
  onReady,
  onPlayingChange,
  onEnded,
  onError,
}: YouTubePlayerProps) {
  const playerElementRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<YouTubePlayerController | null>(null)

  useEffect(() => {
    let isCancelled = false

    void loadYouTubeIframeApi()
      .then((api) => {
        const element = playerElementRef.current
        if (isCancelled || !element) return

        playerRef.current = new api.Player(element, {
          videoId,
          playerVars: {
            autoplay: 1,
            controls: 1,
            fs: 1,
            playsinline: 1,
            rel: 0,
          },
          events: {
            onReady: ({ target }) => {
              if (isCancelled) return
              playerRef.current = target
              target.getIframe().title = title
              target.getIframe().allowFullscreen = true
              onReady(target)
              target.playVideo()
            },
            onStateChange: ({ data }) => {
              onPlayingChange(data === 1)
              if (data === 0) onEnded()
            },
            onError,
          },
        })
      })
      .catch(() => {
        if (!isCancelled) onError()
      })

    return () => {
      isCancelled = true
      playerRef.current?.destroy()
      playerRef.current = null
      onReady(null)
    }
  }, [onEnded, onError, onPlayingChange, onReady, title, videoId])

  useEffect(() => {
    playerRef.current?.setVolume(Math.round(volume * 100))
  }, [volume])

  return (
    <div className="audio-player-media-content size-full overflow-hidden bg-ink">
      <div
        ref={playerElementRef}
        title={title}
        className="size-full"
        aria-label={title}
      />
    </div>
  )
}
