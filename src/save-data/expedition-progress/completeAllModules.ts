/**
  File: completeAllModules.ts | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Complete all checkpoints for every visible module.

  Usage:
  - Exposed through the expedition progress context for developer tools.

  Notes:
  - None.
 */
import { visibleModules } from '@/modules/registry'
import type { ExpeditionProgressData } from '../types'
import type { CommitProgress } from './types'

// Complete every checkpoint for every visible module.
export function completeAllModules(
  current: ExpeditionProgressData,
  commitProgress: CommitProgress,
): void {
  const next: ExpeditionProgressData = { ...current }
  const timestamp = new Date().toISOString()
  let hasChanges = false

  for (const module of visibleModules) {
    if (module.checkpoints.length === 0) continue

    const record = current[module.id]
    const checkpoints = { ...record?.checkpoints }
    let moduleHasChanges = !record

    for (const checkpointId of module.checkpoints) {
      if (checkpoints[checkpointId] === undefined) {
        checkpoints[checkpointId] = timestamp
        moduleHasChanges = true
      }
    }

    if (!moduleHasChanges) continue

    next[module.id] = {
      startedAt: record?.startedAt ?? timestamp,
      checkpoints,
    }
    hasChanges = true
  }

  if (hasChanges) commitProgress(next)
}
