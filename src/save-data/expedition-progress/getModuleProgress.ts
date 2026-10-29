/**
  File: getModuleProgress.ts | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Derive a module's completed checkpoint count and status.

  Usage:
  - Shared by progress selectors and change notifications.

  Notes:
  - None.
 */
import type { LearningModule } from '@/modules/types'
import type { ExpeditionProgress, ExpeditionProgressData } from '../types'

// Derive completion counts and status from a module's saved checkpoints.
export function getModuleProgress(
  module: LearningModule,
  progress: ExpeditionProgressData,
): ExpeditionProgress {
  const record = progress[module.id]
  const total = module.checkpoints.length
  const completed = record
    ? module.checkpoints.filter((id) => id in record.checkpoints).length
    : 0

  return {
    completed,
    total,
    status: !record
      ? 'notStarted'
      : total > 0 && completed === total
        ? 'complete'
        : 'inProgress',
  }
}
