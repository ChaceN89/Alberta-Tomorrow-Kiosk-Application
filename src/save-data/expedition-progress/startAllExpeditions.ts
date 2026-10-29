/**
  File: startAllExpeditions.ts | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Start every visible expedition that has not already been started.

  Usage:
  - Exposed through the expedition progress context for developer tools.

  Notes:
  - None.
 */
import { visibleModules } from '@/modules/registry'
import type { ExpeditionProgressData } from '../types'
import type { CommitProgress } from './types'

// Start each visible expedition that has no saved record.
export function startAllExpeditions(
  current: ExpeditionProgressData,
  commitProgress: CommitProgress,
): void {
  const next: ExpeditionProgressData = { ...current }
  const timestamp = new Date().toISOString()
  let hasChanges = false

  for (const module of visibleModules) {
    if (current[module.id]) continue

    next[module.id] = { startedAt: timestamp, checkpoints: {} }
    hasChanges = true
  }

  if (hasChanges) commitProgress(next)
}
