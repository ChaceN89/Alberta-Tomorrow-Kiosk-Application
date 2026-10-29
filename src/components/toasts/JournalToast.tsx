/**
  File: JournalToast.tsx | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Show a journal update with its progress mountain and a journal icon action.

  Usage:
  - Rendered by JournalProvider when an expedition starts or records a checkpoint.

  Notes:
  - None.
 */
import { useTranslation } from 'react-i18next'
import { ExpeditionPeak } from '../modules/ExpeditionPeak'
import { JournalIcon } from '../icons/JournalIcon'
import type { ExpeditionProgress } from '../../journal/useJournal'

type JournalToastProps = {
  message: string
  title: string
  progress: ExpeditionProgress
  onViewJournal: () => void
}

export function JournalToast({
  message,
  title,
  progress,
  onViewJournal,
}: JournalToastProps) {
  const { t } = useTranslation('journal')

  return (
    <div className="flex w-max min-w-[min(16rem,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] items-center gap-3">
      <ExpeditionPeak progress={progress} className="size-12 shrink-0" />
      <p className="min-w-0 grow font-semibold">{message}</p>
      <button
        type="button"
        className="button-secondary size-12 shrink-0 rounded-full p-0"
        aria-label={t('viewJournalFor', { title })}
        onClick={onViewJournal}
      >
        <JournalIcon className="size-10" />
      </button>
    </div>
  )
}
