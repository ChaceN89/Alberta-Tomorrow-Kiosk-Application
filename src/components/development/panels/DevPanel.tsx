/**
  File: DevPanel.tsx | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Provide a consistent accessible popup panel for developer tools.

  Usage:
  - Shared and app-state UI is imported by app or feature flows.

  Notes:
  - None.
 */
import { useId, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

type DevPanelProps = {
  title: string
  onBack: () => void
  children: ReactNode
}

export function DevPanel({ title, onBack, children }: DevPanelProps) {
  const { t } = useTranslation('development')
  const titleId = useId()

  return (
    <section
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      className="max-h-[calc(100dvh-6rem)] overflow-auto rounded-2xl border border-line bg-surface p-4 text-ink shadow-xl"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <h2 id={titleId} className="text-lg font-semibold">
          {title}
        </h2>
        <button
          type="button"
          className="flex size-10 shrink-0 items-center justify-center rounded-lg text-xl text-muted hover:bg-canvas"
          aria-label={t('backToTools')}
          onClick={onBack}
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>
      {children}
    </section>
  )
}
