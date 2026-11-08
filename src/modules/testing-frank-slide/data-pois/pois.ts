/**
  File: pois.ts | Author: Chace Nielson
  Date Created: Nov 6, 2026
  Date Updated: Nov 8, 2026

  Description:
  - Reuse the shared Frank Slide location and add Turtle Mountain as a module POI.

  Usage:
  - Combined with map settings by the module definition.

  Notes:
  - Frank Slide uses the base-map definition; Turtle Mountain is module-specific.
 */
import { getBasePoi } from '@/site-data/POIs/BasePOIList'
import type { ModuleMapPoi } from '@/modules/types'
import { TurtleMountainPoi } from './module-pois/TurtleMountainPoi'
import {
  frankSlideMountainPhotoViewedCheckpoint,
  frankSlidePoiSelectedCheckpoint,
  frankSlideStreetPhotoViewedCheckpoint,
  frankSlideTurtleMountainPoiOpenedCheckpoint,
  frankSlideTurtleMountainRockslidePhotoViewedCheckpoint,
} from '../journal/checkpoints'

const frankSlideBasePoi = getBasePoi('frankSlide')

export const frankSlideMapPois = [
  {
    ...frankSlideBasePoi,
    titleNamespace: 'mapping',
    poiSelectedCheckpointId: frankSlidePoiSelectedCheckpoint,
    additionalCompletionCheckpoints: [
      frankSlideMountainPhotoViewedCheckpoint,
      frankSlideStreetPhotoViewedCheckpoint,
    ],
    infoCheckpoints: {
      mountain: frankSlideMountainPhotoViewedCheckpoint,
      street: frankSlideStreetPhotoViewedCheckpoint,
    },
  },
  {
    id: 'turtleMountain',
    titleKey: 'poi.turtleMountain.title',
    iconCategory: 'naturalPlace',
    coordinates: [-114.4125, 49.5769],
    infoContent: TurtleMountainPoi,
    poiSelectedCheckpointId: frankSlideTurtleMountainPoiOpenedCheckpoint,
    additionalCompletionCheckpoints: [
      frankSlideTurtleMountainRockslidePhotoViewedCheckpoint,
    ],
    infoCheckpoints: {
      rockslidePhotoViewed:
        frankSlideTurtleMountainRockslidePhotoViewedCheckpoint,
    },
  },
] as const satisfies readonly ModuleMapPoi[]
