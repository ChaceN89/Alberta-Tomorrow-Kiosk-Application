/**
  File: isCheckpointComplete.ts | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Nov 5, 2026

  Description:
  - Check whether a module checkpoint has been recorded.

  Usage:
  - Exposed through the expedition progress context.

  Notes:
  - Reads the persisted checkpoint map without changing it.
 */
import type { ExpeditionProgressData } from '../types'

// Check whether a module checkpoint has a saved completion timestamp.
export function isCheckpointComplete(
  progress: ExpeditionProgressData,
  moduleId: string,
  checkpointId: string,
): boolean {
  return Boolean(progress[moduleId]?.checkpoints[checkpointId])
}
