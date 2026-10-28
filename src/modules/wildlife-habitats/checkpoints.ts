/**
  File: checkpoints.ts | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Journal checkpoint ids for the wildlife habitat expedition, in journal page order.
  - Audio checkpoints record starting and finishing the test song, finishing the narration,
    and starting the red fox sound.

  Usage:
  - Module data files are used by their activity.

  Notes:
  - Ids must match journal.entries in module.wildlifeFinder.json.
 */
export const wildlifeCheckpoints = [
  'habitats-matter',
  'audio-1-started',
  'audio-1-finished',
  'audio-2-finished',
  'audio-3-started',
  'swift-fox-home',
  'red-fox-food',
] as const
