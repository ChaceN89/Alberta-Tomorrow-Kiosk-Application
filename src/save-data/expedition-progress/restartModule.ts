/**
  File: restartModule.ts | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Restart a module by clearing its checkpoint completion and notifying subscribers.

  Usage:
  - Exposed through the expedition progress context for developer tools.

  Notes:
  - None.
 */
import { visibleModules } from '@/modules/registry'
import type { ExpeditionProgressData } from '../types'
import type { CommitProgress, NotifyProgressChange } from './types'

// Clear one module's checkpoints and notify progress listeners.
export function restartModule(
  moduleId: string,
  current: ExpeditionProgressData,
  commitProgress: CommitProgress,
  notifyChange: NotifyProgressChange,
): boolean {
  const module = visibleModules.find((entry) => entry.id === moduleId)

  if (!module) {
    console.warn(`Unknown journal module "${moduleId}".`)
    return false
  }

  if (module.checkpoints.length === 0) return false

  const timestamp = new Date().toISOString()
  const next = {
    ...current,
    [moduleId]: { startedAt: timestamp, checkpoints: {} },
  }
  commitProgress(next)
  notifyChange(module, 'updated', next)
  return true
}
