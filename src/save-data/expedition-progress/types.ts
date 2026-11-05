/**
  File: types.ts | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Nov 5, 2026

  Description:
  - Define saved expedition progress and its derived display status.

  Usage:
  - Save-data providers and consumers share these domain types.

  Notes:
  - This is the persisted domain shape; repository details live separately.
 */
// Persisted progress for one module's expedition.
export type ExpeditionRecord = {
  startedAt: string // ISO 8601 timestamp when the expedition record was first created.
  checkpoints: Record<string, string> // Checkpoint IDs mapped to the ISO 8601 timestamp when each was completed.
}

// Saved expedition records indexed by module ID.
export type ExpeditionProgressData = Record<string, ExpeditionRecord>

// Derived checkpoint counts and lifecycle status for one expedition.
export type ExpeditionProgress = {
  completed: number // Number of this module's configured checkpoints completed.
  total: number // Number of checkpoints configured for this module.
  status: 'notStarted' | 'inProgress' | 'complete' // Whether the expedition has not started, is underway, or is complete.
}

// Notification emitted when an expedition record is created or updated.
export type ExpeditionProgressChange = {
  moduleId: string // ID of the module whose saved progress changed.
  kind: 'started' | 'updated' // Distinguishes the initial start from later progress updates.
  progress: ExpeditionProgress // Derived progress summary at the time of this change.
}
