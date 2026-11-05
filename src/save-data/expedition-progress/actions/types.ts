/**
  File: types.ts | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Nov 5, 2026

  Description:
  - Define callbacks shared by progress operations.

  Usage:
  - Imported by operations that update progress or publish a change.

  Notes:
  - These callbacks keep domain operations independent of React state.
 */
import type { LearningModule } from '@/modules/types'
import type { ExpeditionProgressChange, ExpeditionProgressData } from '../types'

export type CommitProgress = (next: ExpeditionProgressData) => void

export type NotifyProgressChange = (
  module: LearningModule,
  kind: ExpeditionProgressChange['kind'],
  next: ExpeditionProgressData,
) => void
