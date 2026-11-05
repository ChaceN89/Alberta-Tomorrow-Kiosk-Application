/**
  File: index.ts | Author: Chace Nielson
  Date Created: Nov 5, 2026
  Date Updated: Nov 5, 2026

  Description:
  - Expose the learner-facing expedition progress feature.

  Usage:
  - Import the provider and hook through this feature entry point.

  Notes:
  - Developer-only progress controls live in the development subfolder.
 */
export { ExpeditionProgressProvider } from './provider/ExpeditionProgressProvider'
export { useExpeditionProgress } from './provider/useExpeditionProgress'
export type {
  ExpeditionProgress,
  ExpeditionProgressChange,
  ExpeditionProgressData,
  ExpeditionRecord,
} from './types'
