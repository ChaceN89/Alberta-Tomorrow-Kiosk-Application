/**
  File: hasCompletedMapWithActivityRemaining.ts | Author: Chace Nielson
  Date Created: Nov 9, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Derive map completion separately from remaining expedition activity work.

  Usage:
  - Used by the map's return-to-activity reminder.

  Notes:
  - Includes POI selection, completion requirements, and media interactions.
 */
import type { LearningModule } from '@/modules/types'

export function hasCompletedMapWithActivityRemaining(
  module: LearningModule,
  completedCheckpoints: readonly string[],
): boolean {
  if (!module.map || !module.activityPage) return false

  const mapCheckpoints = new Set(
    module.map.pois.flatMap((poi) => [
      ...(poi.poiSelectedCheckpointId ? [poi.poiSelectedCheckpointId] : []),
      ...(poi.additionalCompletionCheckpoints ?? []),
      ...Object.values(poi.infoCheckpoints ?? {}),
    ]),
  )
  const completed = new Set(completedCheckpoints)
  return (
    mapCheckpoints.size > 0 &&
    [...mapCheckpoints].every((id) => completed.has(id)) &&
    module.checkpoints.some(
      (id) => !mapCheckpoints.has(id) && !completed.has(id),
    )
  )
}
