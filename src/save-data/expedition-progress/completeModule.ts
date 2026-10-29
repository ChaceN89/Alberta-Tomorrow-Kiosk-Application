/**
  File: completeModule.ts | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Complete every checkpoint in a module and notify progress subscribers.

  Usage:
  - Exposed through the expedition progress context for developer tools.

  Notes:
  - None.
 */
import { visibleModules } from '@/modules/registry'
import type { ExpeditionProgressData } from '../types'
import type { CommitProgress, NotifyProgressChange } from './types'

// Complete every checkpoint in one module and notify listeners.
export function completeModule(
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

  const record = current[moduleId]
  const timestamp = new Date().toISOString()
  const checkpoints = { ...record?.checkpoints }
  let hasChanges = !record

  for (const checkpointId of module.checkpoints) {
    if (checkpoints[checkpointId] !== undefined) continue

    checkpoints[checkpointId] = timestamp
    hasChanges = true
  }

  if (!hasChanges) return false

  const next = {
    ...current,
    [moduleId]: {
      startedAt: record?.startedAt ?? timestamp,
      checkpoints,
    },
  }
  commitProgress(next)
  notifyChange(module, 'updated', next)
  return true
}
