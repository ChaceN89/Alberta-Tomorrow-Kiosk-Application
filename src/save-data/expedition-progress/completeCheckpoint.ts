/**
  File: completeCheckpoint.ts | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Record a valid module checkpoint and notify progress subscribers.

  Usage:
  - Called by module activities and the expedition progress provider.

  Notes:
  - None.
 */
import { visibleModules } from '@/modules/registry'
import type { ExpeditionProgressData } from '../types'
import type { CommitProgress, NotifyProgressChange } from './types'

// Save a valid checkpoint completion and notify progress listeners.
export function completeCheckpoint(
  moduleId: string,
  checkpointId: string,
  current: ExpeditionProgressData,
  commitProgress: CommitProgress,
  notifyChange: NotifyProgressChange,
): void {
  const module = visibleModules.find((entry) => entry.id === moduleId)

  if (!module?.checkpoints.includes(checkpointId)) {
    console.warn(
      `Unknown journal checkpoint "${checkpointId}" for module "${moduleId}".`,
    )
    return
  }

  const record = current[moduleId]

  if (record?.checkpoints[checkpointId]) return

  const now = new Date().toISOString()
  const next = {
    ...current,
    [moduleId]: {
      startedAt: record?.startedAt ?? now,
      checkpoints: { ...record?.checkpoints, [checkpointId]: now },
    },
  }
  commitProgress(next)
  notifyChange(module, 'updated', next)
}
