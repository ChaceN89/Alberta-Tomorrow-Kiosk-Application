/**
  File: entries.ts | Author: Chace Nielson
  Date Created: Nov 6, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Configure every residential-schools checkpoint's journal media attachments.

  Usage:
  - Registered by the module definition; entry copy stays in locales.

  Notes:
  - POI descriptions and media captions remain in the module locale files.
 */
import type { JournalEntryDefinition } from '@/modules/types'
import {
  lesserSlaveLakeAudioFinishedCheckpoint,
  lesserSlaveLakeSchoolPoiSelectedCheckpoint,
  residentialSchoolCheckpoints,
  stAlbertYouvilleMessageOpenedCheckpoint,
  stAlbertYouvilleSchoolPoiSelectedCheckpoint,
  stAlbertYouvilleVideoFinishedCheckpoint,
  stMarysBloodSchoolAudioFinishedCheckpoint,
  stMarysBloodSchoolPhotoViewedCheckpoint,
  stMarysBloodSchoolPoiSelectedCheckpoint,
} from './checkpoints'
import { bloodSchoolAudioTrack, lesserSlaveLakeAudioTrack } from '../data/audio'
import { stAlbertSampleMessage } from '../data/messages'
import { stAlbertYouTubeThumbnail, stAlbertYouTubeTrack } from '../data/videos'
import bloodSchoolLandscape from '../assets/st-marys-landscape.jpg'
import stAlbertRiverValley from '../assets/st-albert-river-valley.jpg'
import lesserSlaveLakeLandscape from '../assets/lesser-slave-lake.jpg'
import bloodSchoolChildrenPhoto from '../assets/blood-school-children.png'
import stAlbertSchoolPhoto from '../assets/st-albert-school-photo.png'
import lesserSlaveLakeAudioCover from '../assets/lesser-slave-lake-audio-cover.jpg'

export const residentialSchoolJournalEntries = {
  // checkpoint for St. Mary's Blood POI - visit the POI location to unlock
  [stMarysBloodSchoolPoiSelectedCheckpoint]: {
    media: [{ type: 'image', src: bloodSchoolLandscape }],
  },
  [stMarysBloodSchoolPhotoViewedCheckpoint]: {
    media: [
      {
        type: 'image',
        src: bloodSchoolChildrenPhoto,
        viewer: {
          title: 'activity.media.bloodPhoto.title',
          description: 'activity.media.bloodPhoto.description',
          alt: 'activity.media.bloodPhoto.alt',
        },
      },
    ],
  },
  [stMarysBloodSchoolAudioFinishedCheckpoint]: {
    media: [{ type: 'track', track: bloodSchoolAudioTrack }],
  },
  [stAlbertYouvilleSchoolPoiSelectedCheckpoint]: {
    media: [{ type: 'image', src: stAlbertRiverValley }],
  },
  [stAlbertYouvilleVideoFinishedCheckpoint]: {
    media: [
      { type: 'track', track: stAlbertYouTubeTrack },
      {
        type: 'image',
        src: stAlbertYouTubeThumbnail,
        thumbnail: stAlbertYouTubeThumbnail,
      },
    ],
  },
  [stAlbertYouvilleMessageOpenedCheckpoint]: {
    media: [
      {
        type: 'message',
        content: stAlbertSampleMessage,
        thumbnail: stAlbertSchoolPhoto,
      },
    ],
  },
  [lesserSlaveLakeSchoolPoiSelectedCheckpoint]: {
    media: [{ type: 'image', src: lesserSlaveLakeLandscape }],
  },
  [lesserSlaveLakeAudioFinishedCheckpoint]: {
    media: [
      { type: 'track', track: lesserSlaveLakeAudioTrack },
      {
        type: 'image',
        src: lesserSlaveLakeAudioCover,
        thumbnail: lesserSlaveLakeAudioCover,
      },
    ],
  },
} satisfies Record<
  (typeof residentialSchoolCheckpoints)[number],
  JournalEntryDefinition
>
