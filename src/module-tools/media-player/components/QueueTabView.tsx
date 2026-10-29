/**
  File: QueueTabView.tsx | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Show the queue as its own tab view in the compact side player.

  Usage:
  - Rendered by AudioPlayerPanel next to the player view.

  Notes:
  - The inactive view slides away and is inert.
 */
import { useTranslation } from 'react-i18next'
import { useAudioPlayer } from '../hooks/useAudioPlayer'
import type { MediaTrack } from '../provider/types'
import { AudioPlayerQueueList } from './AudioPlayerQueueList'

type QueueTabViewProps = {
  isActive: boolean
  getTrackTitle: (track: MediaTrack) => string
}

export function QueueTabView({ isActive, getTrackTitle }: QueueTabViewProps) {
  const { t } = useTranslation('moduleTools')
  const { queue, moveInQueue, removeFromQueue } = useAudioPlayer()

  return (
    <section
      aria-label={t('audioPlayer.queue')}
      aria-hidden={!isActive}
      inert={!isActive}
      className={`audio-panel-tab-view audio-panel-tab-view--queue flex h-full min-w-0 flex-col p-4 ${
        isActive
          ? 'audio-panel-tab-view--active'
          : 'audio-panel-tab-view--inactive'
      }`}
    >
      <div className="mb-3">
        <h2 className="text-lg font-semibold">
          {t('audioPlayer.queueWithCount', { count: queue.length })}
        </h2>
      </div>
      <AudioPlayerQueueList
        queue={queue}
        getTrackTitle={getTrackTitle}
        moveInQueue={moveInQueue}
        removeFromQueue={removeFromQueue}
      />
    </section>
  )
}
