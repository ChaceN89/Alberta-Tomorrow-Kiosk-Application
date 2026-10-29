/**
  File: getCompletedCheckpoints.ts | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Return the recorded checkpoint ids for a module.

  Usage:
  - Exposed through the expedition progress context.

  Notes:
  - None.
 */
import type { ExpeditionProgressData } from '../types'

// Return the checkpoint ids saved for the requested module.
export function getCompletedCheckpoints(
  progress: ExpeditionProgressData,
  moduleId: string,
): readonly string[] {
  return Object.keys(progress[moduleId]?.checkpoints ?? {})
}
