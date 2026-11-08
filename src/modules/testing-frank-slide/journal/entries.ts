/**
  File: entries.ts | Author: Chace Nielson
  Date Created: Nov 6, 2026
  Date Updated: Nov 8, 2026

  Description:
  - Configure journal media for every Frank Slide checkpoint.

  Usage:
  - Registered by the Frank Slide module definition; entry copy stays in locales.

  Notes:
  - The supplied historical images are attached to the POI discovery entry.
 */
import type { JournalEntryDefinition } from '@/modules/types'
import {
  frankSlideCheckpoints,
  frankSlideDateQuizCheckpoint,
  frankSlideEventQuizCheckpoint,
  frankSlideLocationQuizCheckpoint,
  frankSlideMountainPhotoViewedCheckpoint,
  frankSlideMountainQuizCheckpoint,
  frankSlidePoiSelectedCheckpoint,
  frankSlideQuizCompletedCheckpoint,
  frankSlideStreetPhotoViewedCheckpoint,
  frankSlideTurtleMountainPoiOpenedCheckpoint,
  frankSlideTurtleMountainRockslidePhotoViewedCheckpoint,
} from './checkpoints'
import frankSlideMountainArchive from '@/mapping/assets/frank-slide/frank-slide-mountain-archive.png'
import frankSlideStreetArchive from '@/mapping/assets/frank-slide/frank-slide-street-archive.png'
import turtleMountainRockslide from '../assets/turtle-mountain-rockslide.png'

export const frankSlideJournalEntries = {
  [frankSlidePoiSelectedCheckpoint]: {
    media: [
      { type: 'image', src: frankSlideMountainArchive },
      { type: 'image', src: frankSlideStreetArchive },
    ],
  },
  [frankSlideTurtleMountainPoiOpenedCheckpoint]: { media: [] },
  [frankSlideTurtleMountainRockslidePhotoViewedCheckpoint]: {
    media: [
      {
        type: 'image',
        src: turtleMountainRockslide,
        viewer: {
          title: 'poi.turtleMountain.image.title',
          description: 'poi.turtleMountain.image.description',
          alt: 'poi.turtleMountain.image.alt',
        },
      },
    ],
  },
  [frankSlideMountainPhotoViewedCheckpoint]: {
    media: [
      {
        type: 'image',
        src: frankSlideMountainArchive,
        viewer: {
          title: 'poi.images.mountainTitle',
          description: 'poi.images.mountainDescription',
          alt: 'poi.images.mountainAlt',
        },
      },
    ],
  },
  [frankSlideStreetPhotoViewedCheckpoint]: {
    media: [
      {
        type: 'image',
        src: frankSlideStreetArchive,
        viewer: {
          title: 'poi.images.streetTitle',
          description: 'poi.images.streetDescription',
          alt: 'poi.images.streetAlt',
        },
      },
    ],
  },
  [frankSlideEventQuizCheckpoint]: { media: [] },
  [frankSlideMountainQuizCheckpoint]: { media: [] },
  [frankSlideDateQuizCheckpoint]: { media: [] },
  [frankSlideLocationQuizCheckpoint]: { media: [] },
  [frankSlideQuizCompletedCheckpoint]: { media: [] },
} satisfies Record<
  (typeof frankSlideCheckpoints)[number],
  JournalEntryDefinition
>
