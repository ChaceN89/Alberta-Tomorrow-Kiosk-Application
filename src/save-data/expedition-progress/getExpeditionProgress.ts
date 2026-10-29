/**
  File: getExpeditionProgress.ts | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Get the derived progress summary for a module.

  Usage:
  - Exposed through the expedition progress context.

  Notes:
  - None.
 */
import type { LearningModule } from '@/modules/types'
import type { ExpeditionProgress, ExpeditionProgressData } from '../types'
import { getModuleProgress } from './getModuleProgress'

// Return the progress summary for the requested module.
export function getExpeditionProgress(
  module: LearningModule,
  progress: ExpeditionProgressData,
): ExpeditionProgress {
  return getModuleProgress(module, progress)
}
