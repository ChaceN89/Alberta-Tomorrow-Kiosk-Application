/**
  File: pois.ts | Author: Chace Nielson
  Date Created: Nov 6, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Reuse the shared Frank Slide location and add Turtle Mountain as a module POI.

  Usage:
  - Combined with map settings and POI content by the module definition.

  Notes:
  - Frank Slide uses the base-map definition; Turtle Mountain is module-specific.
 */
import { getDefaultPoi } from '@/mapping/map-settings/defaultPOISettings'
import type { ModuleMapPoi } from '@/modules/types'
import {
  frankSlideMountainPhotoViewedCheckpoint,
  frankSlidePoiSelectedCheckpoint,
  frankSlideStreetPhotoViewedCheckpoint,
  frankSlideTurtleMountainPoiOpenedCheckpoint,
} from '../../journal/checkpoints'

const frankSlideBasePoi = getDefaultPoi('frankSlide')

export const frankSlideMapPois = [
  {
    ...frankSlideBasePoi,
    titleNamespace: 'mapping',
    checkpointId: frankSlidePoiSelectedCheckpoint,
    additionalCompletionCheckpoints: [
      frankSlideMountainPhotoViewedCheckpoint,
      frankSlideStreetPhotoViewedCheckpoint,
    ],
  },
  {
    id: 'turtleMountain',
    titleKey: 'poi.turtleMountain.title',
    coordinates: [-114.4125, 49.5769],
    checkpointId: frankSlideTurtleMountainPoiOpenedCheckpoint,
  },
] as const satisfies readonly ModuleMapPoi[]
