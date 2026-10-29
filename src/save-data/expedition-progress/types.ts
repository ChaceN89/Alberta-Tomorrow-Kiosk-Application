/**
  File: types.ts | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Define dependencies shared by expedition progress actions.

  Usage:
  - Individual action modules use these callback types.

  Notes:
  - None.
 */
import type { LearningModule } from '@/modules/types'
import type { ExpeditionProgressChange, ExpeditionProgressData } from '../types'

export type CommitProgress = (next: ExpeditionProgressData) => void

export type NotifyProgressChange = (
  module: LearningModule,
  kind: ExpeditionProgressChange['kind'],
  next: ExpeditionProgressData,
) => void
