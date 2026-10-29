/**
  File: types.ts | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Define the shared props for module-page activity components.

  Usage:
  - Imported by the module preload and expedition runner components.

  Notes:
  - None.
 */
import type { LearningModule } from '@/modules/types'

export type ModuleActivityProps = {
  /** The module selected by the current route. */
  module: LearningModule
}
