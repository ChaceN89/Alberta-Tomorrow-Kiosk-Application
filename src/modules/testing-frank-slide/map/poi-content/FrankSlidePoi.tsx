/**
  File: FrankSlidePoi.tsx | Author: Chace Nielson
  Date Created: Nov 6, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Connect shared Frank Slide information to module photo checkpoints.

  Usage:
  - Rendered in the Frank Slide module information panel.

  Notes:
  - The photographs' source and exact dates have not been verified.
 */
import type { ModuleMapPoiContentProps } from '@/modules/types'
import {
  FrankSlidePoiInfo,
  type FrankSlideArchiveImageId,
} from '@/mapping/poi-content/FrankSlidePoiInfo'
import {
  frankSlideMountainPhotoViewedCheckpoint,
  frankSlideStreetPhotoViewedCheckpoint,
} from '../../journal/checkpoints'

export function FrankSlidePoi({ onComplete }: ModuleMapPoiContentProps) {
  const checkpointByImageId: Record<FrankSlideArchiveImageId, string> = {
    mountain: frankSlideMountainPhotoViewedCheckpoint,
    street: frankSlideStreetPhotoViewedCheckpoint,
  }

  return (
    <FrankSlidePoiInfo
      onImageOpen={(imageId) => onComplete(checkpointByImageId[imageId])}
    />
  )
}
