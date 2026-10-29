/**
  File: progressAllNextCheckpoints.ts | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Record one next checkpoint for every visible expedition.

  Usage:
  - Exposed through the expedition progress context for developer tools.

  Notes:
  - None.
 */
import { visibleModules } from '@/modules/registry'
import type { ExpeditionProgressData } from '../types'
import type { CommitProgress } from './types'

// Record one next checkpoint for each visible expedition.
export function progressAllNextCheckpoints(
  current: ExpeditionProgressData,
  commitProgress: CommitProgress,
): number {
  const next: ExpeditionProgressData = { ...current }
  const timestamp = new Date().toISOString()
  let progressed = 0

  for (const module of visibleModules) {
    const record = current[module.id]
    const checkpointId = module.checkpoints.find(
      (id) => record?.checkpoints[id] === undefined,
    )

    if (!checkpointId) continue

    next[module.id] = {
      startedAt: record?.startedAt ?? timestamp,
      checkpoints: { ...record?.checkpoints, [checkpointId]: timestamp },
    }
    progressed += 1
  }

  if (progressed > 0) commitProgress(next)
  return progressed
}
