/**
  File: progressNextCheckpoint.ts | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Nov 5, 2026

  Description:
  - Record the next incomplete checkpoint in a module.

  Usage:
  - Exposed through the expedition progress context for developer tools.

  Notes:
  - Advances the first incomplete checkpoint in the module's declared order.
 */
import { visibleModules } from '@/modules/registry'
import type { ExpeditionProgressData } from '../types'

// Complete the first checkpoint not yet recorded for a module.
export function progressNextCheckpoint(
  moduleId: string,
  current: ExpeditionProgressData,
  completeCheckpoint: (moduleId: string, checkpointId: string) => void,
): boolean {
  const module = visibleModules.find((entry) => entry.id === moduleId)

  if (!module) {
    console.warn(`Unknown journal module "${moduleId}".`)
    return false
  }

  const currentCheckpoints = current[moduleId]?.checkpoints
  const checkpointId = module.checkpoints.find(
    (id) => currentCheckpoints?.[id] === undefined,
  )

  if (!checkpointId) return false

  completeCheckpoint(moduleId, checkpointId)
  return true
}
