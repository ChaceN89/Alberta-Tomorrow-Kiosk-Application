/**
  File: randomizeModuleCheckpoints.ts | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Randomize checkpoint completion for a module and notify subscribers.

  Usage:
  - Exposed through the expedition progress context for developer tools.

  Notes:
  - None.
 */
import { visibleModules } from '@/modules/registry'
import type { ExpeditionProgressData } from '../types'
import type { CommitProgress, NotifyProgressChange } from './types'

// Randomize checkpoint completion while ensuring the result changes.
export function randomizeModuleCheckpoints(
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
  const checkpoints: Record<string, string> = {}

  for (const checkpointId of module.checkpoints) {
    if (Math.random() < 0.5) checkpoints[checkpointId] = timestamp
  }

  const isUnchanged = module.checkpoints.every(
    (checkpointId) =>
      Boolean(checkpoints[checkpointId]) ===
      Boolean(record?.checkpoints[checkpointId]),
  )

  if (isUnchanged) {
    const index = Math.floor(Math.random() * module.checkpoints.length)
    const checkpointId = module.checkpoints[index]

    if (checkpoints[checkpointId] !== undefined) {
      delete checkpoints[checkpointId]
    } else {
      checkpoints[checkpointId] = timestamp
    }
  }

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
