/**
  File: ModuleTitleBar.tsx | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Nov 9, 2026

  Description:
    - Show a compact module title that expands to reveal its description.

  Usage:
  - Rendered by ModuleExploreMap.

  Notes:
    - The title and description are supplied by the module's localized map content.
 */
import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ExpeditionStatusText } from '@/components/modules/ExpeditionPeak'
import type { ExpeditionProgress } from '@/save-data/expedition-progress'

type ModuleTitleBarProps = {
  title: string
  description: string
  progress: ExpeditionProgress
}

export function ModuleTitleBar({
  title,
  description,
  progress,
}: ModuleTitleBarProps) {
  const { t } = useTranslation('journal')
  const [isDescriptionVisible, setDescriptionVisible] = useState(false)
  const descriptionId = useId()

  return (
    <section
      aria-labelledby="module-map-title"
      className="mapping-module-title-bar panel bg-surface/95 p-4 shadow-xl backdrop-blur"
    >
      <h1 id="module-map-title" className="text-xl md:text-2xl">
        <button
          type="button"
          className="mapping-module-title-bar__toggle"
          aria-expanded={isDescriptionVisible}
          aria-controls={descriptionId}
          onClick={() => setDescriptionVisible((visible) => !visible)}
        >
          <span>{title}</span>
          {progress.status === 'complete' && (
            <span className="inline-flex items-center text-pine">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-6 shrink-0"
              >
                <path d="m5 12 4 4L19 6" />
              </svg>
              <span className="sr-only">{t('status.complete')}</span>
            </span>
          )}
          <span
            aria-hidden="true"
            className="mapping-module-title-bar__chevron"
          />
        </button>
      </h1>
      <div
        id={descriptionId}
        hidden={!isDescriptionVisible}
        className="mapping-module-title-bar__description text-sm text-muted md:text-base"
      >
        <p>{description}</p>
        <p className="mt-2 text-sm font-semibold text-pine">
          <ExpeditionStatusText progress={progress} />
          {progress.status !== 'inProgress' &&
            ` · ${t('progress', {
              completed: progress.completed,
              total: progress.total,
            })}`}
        </p>
      </div>
    </section>
  )
}
