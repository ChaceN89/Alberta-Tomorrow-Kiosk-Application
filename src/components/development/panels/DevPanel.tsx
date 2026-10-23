/**
 * File: DevPanel.tsx | Author: Chace Nielson
 * Created: 2026-10-23 | Updated: 2026-10-23
 * Description: Provide a consistent accessible popup panel for developer tools.
 * Dependencies: React, react-i18next.
 */
import { useId, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

type DevPanelProps = {
  title: string
  onClose: () => void
  children: ReactNode
}

export function DevPanel({ title, onClose, children }: DevPanelProps) {
  const { t } = useTranslation('development')
  const titleId = useId()

  return (
    <section
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      className="max-h-[calc(100dvh-6rem)] overflow-auto rounded-2xl border border-line bg-surface/75 p-4 text-ink shadow-xl backdrop-blur-md"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <h2 id={titleId} className="text-lg font-semibold">
          {title}
        </h2>
        <button
          type="button"
          className="flex size-10 shrink-0 items-center justify-center rounded-lg text-xl text-muted hover:bg-canvas"
          aria-label={t('closePanel')}
          onClick={onClose}
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>
      {children}
    </section>
  )
}
