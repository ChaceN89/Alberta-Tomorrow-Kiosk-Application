/**
 * File: Loading.tsx | Author: Chace Nielson
 * Created: 2026-10-23 | Updated: 2026-10-23
 * Description: Announce loading with an accessible animated spinner.
 * Dependencies: React, react-i18next.
 */
import { useTranslation } from 'react-i18next'

type LoadingProps = {
  label?: string
}

export function Loading({ label }: LoadingProps) {
  const { t } = useTranslation('global')

  return (
    <div
      role="status"
      className="flex items-center justify-center gap-3 py-6 text-muted"
    >
      <span
        aria-hidden="true"
        className="size-5 shrink-0 animate-spin rounded-full border-2 border-line border-t-pine motion-reduce:animate-none"
      />
      <span>{label ?? t('app.loading')}</span>
    </div>
  )
}
