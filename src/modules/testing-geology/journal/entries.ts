/**
  File: entries.ts | Author: Chace Nielson
  Date Created: Nov 6, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Configure every geology checkpoint's journal media attachments.

  Usage:
  - Registered by the geology module definition; entry copy stays in locales.

  Notes:
  - An empty media array means the journal entry contains text only.
 */
import type { JournalEntryDefinition } from '@/modules/types'
import {
  badlandsQuizQuestionCheckpoint,
  geologyCheckpoints,
  geologyNaturalLandscapesVideoStartedCheckpoint,
  geologyOilBarrelModelViewedCheckpoint,
  geologyQuizCompletedCheckpoint,
  glacialBoulderQuizQuestionCheckpoint,
  oilSandsQuizQuestionCheckpoint,
} from './checkpoints'
import { geologyVideos } from '../data/videos'
import {
  oilBarrelModelAssets,
  oilBarrelTexturePreviewUrl,
} from '../data/models'
import geologyLandscapeJournalImage from '../assets/natural-landscapes-journal.jpg'

const geologyVideoTrack = {
  ...geologyVideos[0],
  translation: {
    namespace: 'geology',
    titleKey: 'activity.media.videoTitle',
    subtitleKey: 'title',
  },
}

export const geologyJournalEntries = {
  [geologyOilBarrelModelViewedCheckpoint]: {
    media: [
      {
        type: 'model',
        content: {
          ...oilBarrelModelAssets,
          title: 'activity.media.oilBarrelTitle',
          description: 'activity.media.oilBarrelDescription',
        },
        thumbnail: oilBarrelTexturePreviewUrl,
      },
    ],
  },
  [geologyNaturalLandscapesVideoStartedCheckpoint]: {
    media: [
      { type: 'track', track: geologyVideoTrack },
      { type: 'image', src: geologyLandscapeJournalImage },
    ],
  },
  [geologyQuizCompletedCheckpoint]: {
    media: [{ type: 'image', src: geologyLandscapeJournalImage }],
  },
  [badlandsQuizQuestionCheckpoint]: { media: [] },
  [glacialBoulderQuizQuestionCheckpoint]: { media: [] },
  [oilSandsQuizQuestionCheckpoint]: { media: [] },
} satisfies Record<(typeof geologyCheckpoints)[number], JournalEntryDefinition>
