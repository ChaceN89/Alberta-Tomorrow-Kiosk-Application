/**
  File: checkpoints.ts | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Journal checkpoint ids for the wildlife habitat expedition, in journal page order.
  - Audio checkpoints record listening milestones; the video checkpoint records finishing
    the red fox video.

  Usage:
  - Module data files are used by their activity.

  Notes:
  - Ids must match journal.entries in module.wildlifeFinder.json.
 */
export const foxesVideoCheckpoint = 'foxes-video-finished'

export const wildlifeCheckpoints = [
  'habitats-matter',
  'audio-1-started',
  'audio-1-finished',
  'audio-2-finished',
  'audio-3-started',
  foxesVideoCheckpoint,
  'swift-fox-home',
  'red-fox-food',
  'red-fox-sound-identification',
] as const
