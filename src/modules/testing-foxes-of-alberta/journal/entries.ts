/**
  File: entries.ts | Author: Chace Nielson
  Date Created: Nov 6, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Configure every wildlife checkpoint's journal media attachments.

  Usage:
  - Registered by the wildlife module definition; entry copy stays in locales.

  Notes:
  - An empty media array means the journal entry contains text only.
 */
import type { AudioTrack } from '@/module-tools/media-player/provider/types'
import type { JournalEntryDefinition } from '@/modules/types'
import {
  foxFamilyImageCheckpoint,
  foxFieldListCheckpoint,
  foxFieldMessageCheckpoint,
  foxNarrationFinishedCheckpoint,
  foxRedFoxSoundStartedCheckpoint,
  foxSongFinishedCheckpoint,
  foxSongStartedCheckpoint,
  foxesOfAlbertaCheckpoints,
  foxesVideoFinishedCheckpoint,
  redFoxDietQuizQuestionCheckpoint,
  redFoxSoundQuizQuestionCheckpoint,
  swiftFoxHabitatQuizQuestionCheckpoint,
} from './checkpoints'
import { getPreloadedFoxAudioSource } from '../loading/audioCache'
import { foxesOfAlbertaTracks } from '../data/audio'
import { foxesOfAlbertaVideo } from '../data/videos'
import { foxFamilyImage } from '../data/images'
import { foxFieldList, foxFieldMessage } from '../data/messages'
import foxFieldNoteJournalImage from '../assets/field-note.svg'

function createAudioTrack(
  track: (typeof foxesOfAlbertaTracks)[number],
): AudioTrack {
  return {
    type: 'audio',
    id: track.id,
    src: getPreloadedFoxAudioSource(track.src),
    title: track.key,
    subtitle: 'Foxes of Alberta',
    coverArt: track.coverArt,
    translation: {
      namespace: 'wildlifeFinder',
      titleKey: `listen.tracks.${track.key}.title`,
      subtitleKey: 'title',
    },
  }
}

const foxSongTrack = createAudioTrack(foxesOfAlbertaTracks[0])
const foxNarrationTrack = createAudioTrack(foxesOfAlbertaTracks[1])
const redFoxSoundTrack = createAudioTrack(foxesOfAlbertaTracks[2])

export const foxesJournalEntries = {
  [foxSongStartedCheckpoint]: {
    media: [{ type: 'track', track: foxSongTrack }],
  },
  [foxSongFinishedCheckpoint]: {
    media: [{ type: 'track', track: foxSongTrack }],
  },
  [foxNarrationFinishedCheckpoint]: {
    media: [{ type: 'track', track: foxNarrationTrack }],
  },
  [foxRedFoxSoundStartedCheckpoint]: {
    media: [{ type: 'track', track: redFoxSoundTrack }],
  },
  [foxesVideoFinishedCheckpoint]: {
    media: [
      {
        type: 'track',
        track: {
          ...foxesOfAlbertaVideo,
          title: 'Foxes of Alberta',
          subtitle: 'Alberta Tomorrow',
          translation: {
            namespace: 'wildlifeFinder',
            titleKey: 'listen.videoTitle',
            subtitleKey: 'title',
          },
        },
      },
    ],
  },
  [foxFieldMessageCheckpoint]: {
    media: [
      {
        type: 'message',
        content: foxFieldMessage,
        thumbnail: foxFieldNoteJournalImage,
      },
    ],
  },
  [foxFieldListCheckpoint]: {
    media: [
      {
        type: 'message',
        content: foxFieldList,
        thumbnail: foxFieldNoteJournalImage,
      },
    ],
  },
  [foxFamilyImageCheckpoint]: {
    media: [
      {
        type: 'image',
        src: foxFamilyImage.src,
        viewer: {
          title: foxFamilyImage.title,
          description: foxFamilyImage.description,
          alt: foxFamilyImage.alt,
        },
      },
    ],
  },
  [swiftFoxHabitatQuizQuestionCheckpoint]: { media: [] },
  [redFoxDietQuizQuestionCheckpoint]: { media: [] },
  [redFoxSoundQuizQuestionCheckpoint]: { media: [] },
} satisfies Record<
  (typeof foxesOfAlbertaCheckpoints)[number],
  JournalEntryDefinition
>
