/**
  File: completeCheckpoint.ts | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Nov 5, 2026

  Description:
  - Record a valid module checkpoint and notify progress subscribers.

  Usage:
  - Called by module activities and the expedition progress provider.

  Notes:
  - Unknown module or checkpoint ids are reported and not saved.
 */
import { visibleModules } from '@/modules/registry'
import type { ExpeditionProgressData } from '../types'
import type { CommitProgress, NotifyProgressChange } from './types'
import type { LearningModule } from '@/modules/types'

// Save a valid checkpoint completion and notify progress listeners.
export function completeCheckpoint(
  moduleId: string,
  checkpointId: string,
  current: ExpeditionProgressData,
  commitProgress: CommitProgress,
  notifyChange: NotifyProgressChange,
): void {
  // get the module definition for the given moduleId
  const module: LearningModule | undefined = visibleModules.find(
    (entry) => entry.id === moduleId,
  )

  // if the module is not found or the checkpoint is not part of the module, warn and exit
  if (!module?.checkpoints.includes(checkpointId)) {
    console.warn(
      `Unknown journal checkpoint "${checkpointId}" for module "${moduleId}".`,
    )
    return
  }

  // get the current record for the module, if it exists
  const record = current[moduleId]

  // if the checkpoint is already completed, do nothing
  if (record?.checkpoints[checkpointId]) return

  // create the next state with the new checkpoint completion
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
