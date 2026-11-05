/**
  File: ExpeditionEntryHeader.tsx | Author: Chace Nielson
  Date Created: Nov 5, 2026
  Date Updated: Nov 5, 2026

  Description:
  - Render an expedition peak alongside its localized module title and status.

  Usage:
  - Rendered at the top of an ExpeditionEntry.

  Notes:
  - Uses the same progress value for both the peak and its localized status.
 */
import {
  ExpeditionPeak,
  ExpeditionStatusText,
} from '@/components/modules/ExpeditionPeak'
import { ModuleTitle } from '@/components/modules/ModuleTitle'
import type { ExpeditionProgress } from '@/save-data/types'
import type { LearningModule } from '@/modules/types'

type ExpeditionEntryHeaderProps = {
  module: LearningModule
  progress: ExpeditionProgress
}

// Pair the module's localized title with its current expedition progress.
export function ExpeditionEntryHeader({
  module,
  progress,
}: ExpeditionEntryHeaderProps) {
  return (
    <header className="flex items-center gap-4">
      <ExpeditionPeak progress={progress} className="size-20" />
      <div className="min-w-0">
        <h3 className="text-xl font-semibold">
          <ModuleTitle module={module} />
        </h3>
        <p className="text-sm font-semibold text-pine">
          <ExpeditionStatusText progress={progress} />
        </p>
      </div>
    </header>
  )
}
