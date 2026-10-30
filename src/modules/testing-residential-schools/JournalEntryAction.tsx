/**
  File: JournalEntryAction.tsx | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Offer replay controls for residential-school audio and video journal entries.

  Usage:
  - Lazy-rendered by the journal for completed residential-school media entries.

  Notes:
  - Replay does not unlock an entry; media completion records its existing checkpoint.
 */
import { TrackPlayButton } from '@/module-tools/media-player/components/TrackPlayButton'
import type { JournalEntryActionProps } from '@/modules/types'
import {
  bloodSchoolAudioCheckpoint,
  lesserSlaveLakeAudioCheckpoint,
  stAlbertVideoCheckpoint,
} from './checkpoints'
import { bloodSchoolAudioTrack, lesserSlaveLakeAudioTrack } from './tracks'
import { stAlbertYouTubeTrack } from './videos'
import { useExpeditionProgress } from '@/save-data/useExpeditionProgress'

export default function JournalEntryAction({
  entryId,
  moduleId,
}: JournalEntryActionProps) {
  const { completeCheckpoint } = useExpeditionProgress()

  const track =
    entryId === bloodSchoolAudioCheckpoint
      ? bloodSchoolAudioTrack
      : entryId === stAlbertVideoCheckpoint
        ? stAlbertYouTubeTrack
        : entryId === lesserSlaveLakeAudioCheckpoint
          ? lesserSlaveLakeAudioTrack
          : null

  if (!track) return null

  return (
    <TrackPlayButton
      track={track}
      onEnd={() => completeCheckpoint(moduleId, entryId)}
    />
  )
}
