/**
  File: JournalEntryAction.tsx | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Offer replay controls for completed wildlife audio and video journal entries.

  Usage:
  - Lazy-rendered by the journal for completed wildlife entries.

  Notes:
  - Reuses expedition tracks and their existing listening checkpoints.
 */
import { useTranslation } from 'react-i18next'
import { TrackPlayButton } from '@/module-tools/media-player/TrackPlayButton'
import { useJournal } from '@/journal/useJournal'
import type { JournalEntryActionProps } from '@/modules/types'
import { getPreloadedFoxAudioSource } from '@/modules/testing-foxes-of-alberta/audioCache'
import { foxesVideoCheckpoint } from '@/modules/testing-foxes-of-alberta/checkpoints'
import { foxesOfAlbertaTracks } from '@/modules/testing-foxes-of-alberta/tracks'
import { foxesOfAlbertaVideo } from '@/modules/testing-foxes-of-alberta/videos'

export default function JournalEntryAction({
  entryId,
  moduleId,
}: JournalEntryActionProps) {
  const { t } = useTranslation('wildlifeFinder')
  const { completeCheckpoint } = useJournal()

  if (entryId === foxesVideoCheckpoint) {
    return (
      <TrackPlayButton
        track={{
          ...foxesOfAlbertaVideo,
          title: t('listen.videoTitle'),
          subtitle: t('title'),
          translation: {
            namespace: 'wildlifeFinder',
            titleKey: 'listen.videoTitle',
            subtitleKey: 'title',
          },
        }}
        onEnd={() => completeCheckpoint(moduleId, foxesVideoCheckpoint)}
      />
    )
  }

  const track = foxesOfAlbertaTracks.find(
    (item) =>
      ('startCheckpoint' in item && item.startCheckpoint === entryId) ||
      ('endCheckpoint' in item && item.endCheckpoint === entryId),
  )

  if (!track) return null
  if (
    'startCheckpoint' in track &&
    'endCheckpoint' in track &&
    track.startCheckpoint === entryId
  ) {
    return null
  }

  return (
    <TrackPlayButton
      track={{
        type: 'audio',
        id: track.id,
        src: getPreloadedFoxAudioSource(track.src),
        coverArt: track.coverArt,
        title: t(`listen.tracks.${track.key}.title`),
        subtitle: t('title'),
        translation: {
          namespace: 'wildlifeFinder',
          titleKey: `listen.tracks.${track.key}.title`,
          subtitleKey: 'title',
        },
      }}
      onStart={
        'startCheckpoint' in track
          ? () => completeCheckpoint(moduleId, track.startCheckpoint)
          : undefined
      }
      onEnd={
        'endCheckpoint' in track
          ? () => completeCheckpoint(moduleId, track.endCheckpoint)
          : undefined
      }
    />
  )
}
