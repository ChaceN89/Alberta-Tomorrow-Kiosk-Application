/**
  File: ViewerHeader.tsx | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Show the viewer's title and close button.

  Usage:
  - Rendered at the top of every viewer by MediaViewerDialog.

  Notes:
  - The title element's id labels the dialog.
 */
import { useTranslation } from 'react-i18next'

type ViewerHeaderProps = {
  title: string
  titleId: string
  onClose: () => void
}

export function ViewerHeader({ title, titleId, onClose }: ViewerHeaderProps) {
  const { t } = useTranslation('moduleTools')

  return (
    <header className="flex shrink-0 items-center justify-between gap-4 border-b border-line p-4 md:px-6">
      <h2 id={titleId} className="text-xl">
        {title}
      </h2>
      <button
        type="button"
        className="flex size-12 shrink-0 items-center justify-center rounded-xl text-2xl text-muted hover:bg-canvas"
        aria-label={t('mediaViewer.close')}
        onClick={onClose}
      >
        <span aria-hidden="true">×</span>
      </button>
    </header>
  )
}
