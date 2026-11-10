/**
  File: setModuleDiscovered.ts | Author: Chace Nielson
  Date Created: Nov 9, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Set expedition discovery using the existing started progress record.

  Usage:
  - Exposed only through expedition progress developer tools.

  Notes:
  - Making an expedition undiscovered removes its saved checkpoints too.
 */
import { visibleModules } from '@/modules/registry'
import { startExpedition } from '../actions/startExpedition'
import type { CommitProgress, NotifyProgressChange } from '../actions/types'
import type { ExpeditionProgressData } from '../types'

export function setModuleDiscovered(
  moduleId: string,
  discovered: boolean,
  current: ExpeditionProgressData,
  commitProgress: CommitProgress,
  notifyChange: NotifyProgressChange,
): boolean {
  const module = visibleModules.find((entry) => entry.id === moduleId)
  if (!module) {
    console.warn(`Unknown journal module "${moduleId}".`)
    return false
  }

  if (discovered) {
    startExpedition(moduleId, current, commitProgress, notifyChange)
  } else if (current[moduleId]) {
    const next = { ...current }
    delete next[moduleId]
    commitProgress(next)
    notifyChange(module, 'updated', next)
  }
  return true
}
