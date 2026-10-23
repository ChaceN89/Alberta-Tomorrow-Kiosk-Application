/**
 * File: ResetConfirmPanel.tsx | Author: Chace Nielson
 * Created: 2026-10-23 | Updated: 2026-10-23
 * Description: Ask for a Yes/No confirmation in the developer tools panel style.
 * Dependencies: DevPanel, react-i18next.
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
