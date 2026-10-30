/**
  File: AudioPlayerQueueList.tsx | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Render queued media items with reorder and optional remove controls.

  Usage:
  - AudioPlayerPanel uses this list in its queue tab and fullscreen queue.

  Notes:
  - Track titles are supplied by the panel so localized media labels stay consistent.
 */
import { useTranslation } from 'react-i18next'
import {
  CloseIcon,
  MoveDownIcon,
  MoveUpIcon,
  MusicNoteIcon,
  VideoIcon,
} from './AudioPlayerIcons'
import type { MediaTrack, QueuedAudioTrack } from '../provider/types'
import defaultAudioCover from '@/assets/default-audio-cover.svg'

type AudioPlayerQueueListProps = {
  queue: readonly QueuedAudioTrack[]
  getTrackTitle: (track: MediaTrack) => string
  moveInQueue: (queueId: number, direction: 'up' | 'down') => void
  removeFromQueue: (queueId: number) => void
  showRemoveButton?: boolean
}

export function AudioPlayerQueueList({
  queue,
  getTrackTitle,
  moveInQueue,
  removeFromQueue,
  showRemoveButton = true,
}: AudioPlayerQueueListProps) {
  const { t } = useTranslation('moduleTools')

  if (queue.length === 0) {
    return <p className="text-sm text-muted">{t('audioPlayer.queueEmpty')}</p>
  }

  return (
    <ol className="min-h-0 min-w-0 flex-1 space-y-2 overflow-x-hidden overflow-y-auto overscroll-contain pr-2 scrollbar-thin">
      {queue.map(({ queueId, track }, index) => {
        const title = getTrackTitle(track)

        return (
          <li key={queueId} className="flex min-w-0 items-center gap-2">
            <img
              src={track.coverArt ?? defaultAudioCover}
              alt=""
              className="size-10 shrink-0 rounded object-cover"
            />
            {track.type === 'audio' ? (
              <MusicNoteIcon className="size-4 shrink-0 text-muted" />
            ) : (
              <VideoIcon className="size-4 shrink-0 text-muted" />
            )}
            <span className="min-w-0 grow truncate text-sm">{title}</span>
            <div className="flex shrink-0">
              <button
                type="button"
                className="flex size-10 items-center justify-center rounded-lg text-muted hover:bg-canvas disabled:cursor-not-allowed disabled:opacity-40"
                aria-label={t('audioPlayer.moveUp', { title })}
                disabled={index === 0}
                onClick={() => moveInQueue(queueId, 'up')}
              >
                <MoveUpIcon className="size-4" />
              </button>
              <button
                type="button"
                className="flex size-10 items-center justify-center rounded-lg text-muted hover:bg-canvas disabled:cursor-not-allowed disabled:opacity-40"
                aria-label={t('audioPlayer.moveDown', { title })}
                disabled={index === queue.length - 1}
                onClick={() => moveInQueue(queueId, 'down')}
              >
                <MoveDownIcon className="size-4" />
              </button>
            </div>
            {showRemoveButton && (
              <button
                type="button"
                className="flex size-10 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-canvas"
                aria-label={t('audioPlayer.removeFromQueue', { title })}
                onClick={() => removeFromQueue(queueId)}
              >
                <CloseIcon className="size-4" />
              </button>
            )}
          </li>
        )
      })}
    </ol>
  )
}
