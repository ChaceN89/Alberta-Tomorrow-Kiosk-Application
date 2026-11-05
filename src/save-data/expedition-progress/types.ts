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
export type ExpeditionRecord = {
  startedAt: string
  checkpoints: Record<string, string>
}

export type ExpeditionProgressData = Record<string, ExpeditionRecord>

export type ExpeditionProgress = {
  completed: number
  total: number
  status: 'notStarted' | 'inProgress' | 'complete'
}

export type ExpeditionProgressChange = {
  moduleId: string
  kind: 'started' | 'updated'
  progress: ExpeditionProgress
}
