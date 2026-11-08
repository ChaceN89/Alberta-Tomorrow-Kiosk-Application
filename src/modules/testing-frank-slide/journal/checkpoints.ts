/**
  File: checkpoints.ts | Author: Chace Nielson
  Date Created: Nov 6, 2026
  Date Updated: Nov 8, 2026

  Description:
  - Define every Frank Slide checkpoint and its journal ordering.

  Usage:
  - Map and quiz data import these constants.

  Notes:
  - The Frank Slide POI checkpoint unlocks the activity quiz.
  - Turtle Mountain tracks POI exploration and rockslide-photo viewing separately.
 */
export const frankSlidePoiSelectedCheckpoint = 'frank-slide-poi-selected'
export const frankSlideTurtleMountainPoiOpenedCheckpoint =
  'frank-slide-turtle-mountain-poi-opened'
export const frankSlideTurtleMountainRockslidePhotoViewedCheckpoint =
  'frank-slide-turtle-mountain-rockslide-photo-viewed'
export const frankSlideMountainPhotoViewedCheckpoint =
  'frank-slide-mountain-photo-viewed'
export const frankSlideStreetPhotoViewedCheckpoint =
  'frank-slide-street-photo-viewed'
export const frankSlideEventQuizCheckpoint = 'frank-slide-quiz-event'
export const frankSlideMountainQuizCheckpoint = 'frank-slide-quiz-mountain'
export const frankSlideDateQuizCheckpoint = 'frank-slide-quiz-date'
export const frankSlideLocationQuizCheckpoint = 'frank-slide-quiz-location'
export const frankSlideQuizCompletedCheckpoint = 'frank-slide-quiz-completed'

export const frankSlideCheckpoints = [
  frankSlidePoiSelectedCheckpoint,
  frankSlideTurtleMountainPoiOpenedCheckpoint,
  frankSlideTurtleMountainRockslidePhotoViewedCheckpoint,
  frankSlideMountainPhotoViewedCheckpoint,
  frankSlideStreetPhotoViewedCheckpoint,
  frankSlideEventQuizCheckpoint,
  frankSlideMountainQuizCheckpoint,
  frankSlideDateQuizCheckpoint,
  frankSlideLocationQuizCheckpoint,
  frankSlideQuizCompletedCheckpoint,
] as const
