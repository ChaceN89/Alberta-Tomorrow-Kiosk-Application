/**
  File: FullscreenQueue.tsx | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Show the "Up next" queue beside the controls while the player is full screen.

  Usage:
  - Rendered in the player's lower area by AudioPlayerPanel.

  Notes:
  - The column resizes with the player; its padded panel keeps a minimum width so the
    content is revealed rather than squashed. Styles are in AudioPlayer.css.
 */
import { useTranslation } from 'react-i18next'
import { useAudioPlayer } from '../hooks/useAudioPlayer'
import type { MediaTrack } from '../provider/types'
import { AudioPlayerQueueList } from './AudioPlayerQueueList'

type FullscreenQueueProps = {
  isFullscreen: boolean
  getTrackTitle: (track: MediaTrack) => string
}

export function FullscreenQueue({
  isFullscreen,
  getTrackTitle,
}: FullscreenQueueProps) {
  const { t } = useTranslation('moduleTools')
  const { queue, moveInQueue, removeFromQueue } = useAudioPlayer()
  const label = t('audioPlayer.queueWithCount', { count: queue.length })

  return (
    <section
      aria-label={label}
      aria-hidden={!isFullscreen}
      inert={!isFullscreen}
      className={`audio-player-queue min-h-0 min-w-0 ${
        isFullscreen ? 'audio-player-queue--visible' : ''
      }`}
    >
      {/* Padding lives here so the outer column can shrink to zero width. */}
      <div className="audio-player-queue__panel flex flex-col border-t border-line px-4 py-3 md:border-t-0 md:border-l">
        <h2 className="mb-2 shrink-0 text-lg font-semibold">{label}</h2>
        <AudioPlayerQueueList
          queue={queue}
          getTrackTitle={getTrackTitle}
          moveInQueue={moveInQueue}
          removeFromQueue={removeFromQueue}
        />
      </div>
    </section>
  )
}
