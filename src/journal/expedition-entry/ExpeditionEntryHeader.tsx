/**
  File: ExpeditionEntryHeader.tsx | Author: Chace Nielson
  Date Created: Nov 5, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Render the module title, progress, and viewable journal image.

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
import { useMediaViewer } from '@/module-tools/media-viewer/hooks/useMediaViewer'
import { PaperclipFrame } from './PaperclipFrame'
import { useTranslation } from 'react-i18next'
import type { ExpeditionProgress } from '@/save-data/expedition-progress'
import type { LearningModule } from '@/modules/types'

type ExpeditionEntryHeaderProps = {
  module: LearningModule
  progress: ExpeditionProgress
}

// Pair the module's localized title and progress with its representative image.
export function ExpeditionEntryHeader({
  module,
  progress,
}: ExpeditionEntryHeaderProps) {
  const { t: tJournal } = useTranslation('journal')
  const { t: tModule } = useTranslation(module.translationNamespace)
  const { openImage } = useMediaViewer()
  const title = tModule(module.titleKey)

  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex min-w-0 flex-1 basis-64 items-center gap-4">
        <ExpeditionPeak progress={progress} className="size-20" />
        <div className="min-w-0">
          <h3 className="text-xl font-semibold">
            <ModuleTitle module={module} />
          </h3>
          <p className="text-sm font-semibold text-pine">
            <ExpeditionStatusText progress={progress} />
          </p>
        </div>
      </div>
      <PaperclipFrame className="ml-auto shrink-0">
        <button
          type="button"
          className="group block rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          aria-label={tJournal('openImage', { title })}
          onClick={(event) =>
            openImage(
              {
                title,
                description: tModule(module.descriptionKey),
                alt: title,
                src: module.journalImage,
              },
              { origin: event.currentTarget },
            )
          }
        >
          <img
            src={module.journalImage}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-32 w-52 rounded-md object-cover -rotate-3 transition-transform duration-200 ease-out group-hover:rotate-0 group-focus-visible:rotate-0 motion-reduce:transition-none"
          />
        </button>
      </PaperclipFrame>
    </header>
  )
}
