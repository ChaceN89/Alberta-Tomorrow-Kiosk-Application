/**
  File: checkpoints.ts | Author: Chace Nielson
  Date Created: Nov 6, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Define every Frank Slide checkpoint and its journal ordering.

  Usage:
  - Map and quiz data import these constants.

  Notes:
  - The Frank Slide POI checkpoint unlocks the activity quiz.
  - Turtle Mountain has a separate checkpoint recorded when its POI opens.
 */
export const frankSlidePoiSelectedCheckpoint = 'frank-slide-poi-selected'
export const frankSlideTurtleMountainPoiOpenedCheckpoint =
  'frank-slide-turtle-mountain-poi-opened'
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
  frankSlideMountainPhotoViewedCheckpoint,
  frankSlideStreetPhotoViewedCheckpoint,
  frankSlideEventQuizCheckpoint,
  frankSlideMountainQuizCheckpoint,
  frankSlideDateQuizCheckpoint,
  frankSlideLocationQuizCheckpoint,
  frankSlideQuizCompletedCheckpoint,
] as const
