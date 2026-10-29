/**
  File: CloseConfirmDialog.tsx | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Ask before closing a player that still has queued media.

  Usage:
  - Rendered inside the player frame by AudioPlayerPanel while confirming.

  Notes:
  - Focus starts on Cancel and Escape cancels.
 */
import { useEffect, useId, useRef } from 'react'
import { useTranslation } from 'react-i18next'

type CloseConfirmDialogProps = {
  isCollapsed: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function CloseConfirmDialog({
  isCollapsed,
  onConfirm,
  onCancel,
}: CloseConfirmDialogProps) {
  const { t } = useTranslation('moduleTools')
  const cancelRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()

  useEffect(() => {
    cancelRef.current?.focus()
  }, [])

  useEffect(() => {
    const cancelOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel()
    }

    document.addEventListener('keydown', cancelOnEscape)
    return () => document.removeEventListener('keydown', cancelOnEscape)
  }, [onCancel])

  return (
    <div
      className={`audio-close-dialog pointer-events-auto absolute inset-0 z-(--z-player-dialog) grid place-items-center p-4 ${
        isCollapsed ? 'audio-close-dialog--collapsed' : 'bg-ink/50'
      }`}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="audio-close-dialog__content w-full max-w-sm space-y-4 rounded-2xl border border-line bg-surface p-6 text-ink shadow-2xl"
      >
        <h2 id={titleId}>{t('audioPlayer.confirmCloseTitle')}</h2>
        <p>{t('audioPlayer.confirmCloseDescription')}</p>
        <div className="flex flex-wrap justify-end gap-3">
          <button type="button" className="button" onClick={onConfirm}>
            {t('audioPlayer.confirmClose')}
          </button>
          <button
            ref={cancelRef}
            type="button"
            className="button-secondary"
            onClick={onCancel}
          >
            {t('audioPlayer.cancelClose')}
          </button>
        </div>
      </div>
    </div>
  )
}
