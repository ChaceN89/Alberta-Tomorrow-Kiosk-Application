/**
  File: pois.ts | Author: Chace Nielson
  Date Created: Nov 6, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Combine Frank Slide, Lundbreck Falls, Turtle Mountain, and Crowsnest Pass POIs.

  Usage:
  - Combined with map settings by the module definition.

  Notes:
  - Frank Slide reuses its base-map definition; the other POIs are module-specific.
 */
import { getBasePoi } from '@/mapping/POIs/BasePOIList'
import type { ModuleMapPoi } from '@/modules/types'
import { TurtleMountainPoi } from './module-pois/TurtleMountainPoi'
import { LundbreckFallsPoi } from './module-pois/LundbreckFallsPoi'
import { CrowsnestPassPoi } from './module-pois/CrowsnestPassPoi'
import {
  frankSlideCrowsnestPassPoiOpenedCheckpoint,
  frankSlideMountainPhotoViewedCheckpoint,
  frankSlideLundbreckFallsPoiOpenedCheckpoint,
  frankSlidePoiSelectedCheckpoint,
  frankSlideStreetPhotoViewedCheckpoint,
  frankSlideTurtleMountainPoiOpenedCheckpoint,
  frankSlideTurtleMountainRockslidePhotoViewedCheckpoint,
} from '../journal/checkpoints'

const frankSlideBasePoi = getBasePoi('frankSlide')

export const frankSlideMapPois = [
  {
    id: 'lundbreckFalls',
    flyoverPoiFov: 24,
    flyoverRadiusMultiplier: 0.5,
    flyoverCylinderHeightMultiplier: 0.7,
    titleKey: 'poi.lundbreckFalls.title',
    iconCategory: 'naturalPlace',
    coordinates: [-114.20861, 49.58222],
    infoContent: LundbreckFallsPoi,
    poiSelectedCheckpointId: frankSlideLundbreckFallsPoiOpenedCheckpoint,
  },
  {
    ...frankSlideBasePoi,
    flyoverPoiFov: 50,
    flyoverRadiusMultiplier: 0.5,
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
    flyoverPoiFov: 55,
    flyoverRadiusMultiplier: 0.5,
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
  {
    id: 'crowsnestPass',
    flyoverPoiFov: 70,
    flyoverCylinderHeightMultiplier: 0.75,
    titleKey: 'poi.crowsnestPass.title',
    iconCategory: 'naturalPlace',
    coordinates: [-114.69, 49.633],
    infoContent: CrowsnestPassPoi,
    poiSelectedCheckpointId: frankSlideCrowsnestPassPoiOpenedCheckpoint,
  },
] as const satisfies readonly ModuleMapPoi[]
