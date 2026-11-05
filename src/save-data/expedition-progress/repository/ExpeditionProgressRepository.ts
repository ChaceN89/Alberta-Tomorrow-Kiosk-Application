/**
  File: ExpeditionProgressRepository.ts | Author: Chace Nielson
  Date Created: Nov 5, 2026
  Date Updated: Nov 5, 2026

  Description:
  - Define the persistence boundary for expedition progress.

  Usage:
  - Implement this interface for the current browser store or a future account-backed adapter.

  Notes:
  - All methods are asynchronous so browser and account-backed stores share one contract.
 */
import type { ExpeditionProgressData } from '../types'

export type ExpeditionProgressLoadResult = {
  progress: ExpeditionProgressData
  isAvailable: boolean
}

export interface ExpeditionProgressRepository {
  load: () => Promise<ExpeditionProgressLoadResult>
  save: (progress: ExpeditionProgressData) => Promise<boolean>
  clear: () => Promise<boolean>
}
