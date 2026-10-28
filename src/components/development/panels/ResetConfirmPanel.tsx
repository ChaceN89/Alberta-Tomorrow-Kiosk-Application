/**
  File: ResetConfirmPanel.tsx | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 23, 2026

  Description:
  - Ask for a Yes/No confirmation in the developer tools panel style.

  Usage:
  - Shared and app-state UI is imported by app or feature flows.

  Notes:
  - None.
 */
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { DevPanel } from './DevPanel'

type ResetConfirmPanelProps = {
  title: string
  description: string
  onConfirm: () => void
  onCancel: () => void
}

export function ResetConfirmPanel({
  title,
  description,
  onConfirm,
  onCancel,
}: ResetConfirmPanelProps) {
  const { t } = useTranslation('development')
  const cancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    // "No" is focused so pressing Enter never confirms by accident.
    cancelRef.current?.focus()
  }, [])

  return (
    <DevPanel title={title} onClose={onCancel}>
      <p className="mb-3 text-sm text-muted">{description}</p>
      <div className="grid gap-2">
        <button type="button" className="button w-full" onClick={onConfirm}>
          {t('confirmYes')}
        </button>
        <button
          ref={cancelRef}
          type="button"
          className="button-secondary w-full"
          onClick={onCancel}
        >
          {t('confirmNo')}
        </button>
      </div>
    </DevPanel>
  )
}
