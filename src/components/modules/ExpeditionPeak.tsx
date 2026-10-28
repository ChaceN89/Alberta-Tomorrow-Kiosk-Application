/**
  File: ExpeditionPeak.tsx | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 23, 2026

  Description:
  - Show an expedition's mountain, filled by progress and flagged when complete.

  Usage:
  - Module shared UI is used by module pages.

  Notes:
  - None.
 */
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import type { ExpeditionProgress } from '../../journal/useJournal'

type ExpeditionPeakProps = {
  progress: ExpeditionProgress
  className?: string
}

type ExpeditionStatusTextProps = {
  progress: ExpeditionProgress
}

const PEAK_PATH = 'M4 40 19 14l7 11 5-7 13 22Z'
const PEAK_TOP = 14
const PEAK_BASE = 40

export function ExpeditionPeak({
  progress,
  className = 'size-12',
}: ExpeditionPeakProps) {
  const clipId = useId().replace(/:/g, '')
  const ratio = progress.total === 0 ? 0 : progress.completed / progress.total
  const fillHeight = (PEAK_BASE - PEAK_TOP) * ratio
  const color = progress.status === 'notStarted' ? 'text-muted' : 'text-pine'

  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      focusable="false"
      className={`shrink-0 ${color} ${className}`}
    >
      <defs>
        <clipPath id={clipId}>
          <rect
            x="0"
            y={PEAK_BASE - fillHeight}
            width="48"
            height={fillHeight}
          />
        </clipPath>
      </defs>
      <path d={PEAK_PATH} fill="currentColor" clipPath={`url(#${clipId})`} />
      <path
        d={PEAK_PATH}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {progress.status === 'complete' && (
        <>
          <path
            d="M19 14V4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path d="m19 4 10 3.5L19 11Z" className="fill-flag" />
        </>
      )}
    </svg>
  )
}

export function ExpeditionStatusText({ progress }: ExpeditionStatusTextProps) {
  const { t } = useTranslation('journal')

  return (
    <span>
      {t(`status.${progress.status}`)}
      {progress.status === 'inProgress' &&
        ` · ${t('progress', {
          completed: progress.completed,
          total: progress.total,
        })}`}
    </span>
  )
}
