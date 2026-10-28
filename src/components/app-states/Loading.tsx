/**
  File: Loading.tsx | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 23, 2026

  Description:
  - Display a reusable loading status with an accessible animated spinner.

  Usage:
  - Shared and app-state UI is imported by app or feature flows.

  Notes:
  - None.
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
