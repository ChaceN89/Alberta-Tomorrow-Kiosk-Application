/**
  File: startExpedition.ts | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Start an expedition if it has not already been started.

  Usage:
  - Called by the expedition progress provider.

  Notes:
  - None.
 */
import { visibleModules } from '@/modules/registry'
import type { ExpeditionProgressData } from '../types'
import type { CommitProgress, NotifyProgressChange } from './types'

// Start an expedition that has not already been recorded.
export function startExpedition(
  moduleId: string,
  current: ExpeditionProgressData,
  commitProgress: CommitProgress,
  notifyChange: NotifyProgressChange,
): void {
  const module = visibleModules.find((entry) => entry.id === moduleId)

  if (!module || current[moduleId]) return

  const next = {
    ...current,
    [moduleId]: { startedAt: new Date().toISOString(), checkpoints: {} },
  }
  commitProgress(next)
  notifyChange(module, 'started', next)
}
