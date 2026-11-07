/**
  File: ExpeditionEntryActions.tsx | Author: Chace Nielson
  Date Created: Nov 5, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Render the link to continue an expedition.

  Usage:
  - Rendered at the bottom of an ExpeditionEntry.

  Notes:
  - Navigation closes the journal after the selected route is followed.
 */
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { getModuleActivityPath } from '@/modules/routes'
import type { ExpeditionProgress } from '@/save-data/expedition-progress'

type ExpeditionEntryActionsProps = {
  moduleId: string
  progress: ExpeditionProgress
  onNavigate: () => void
}

// Provide the module's activity link from the journal.
export function ExpeditionEntryActions({
  moduleId,
  progress,
  onNavigate,
}: ExpeditionEntryActionsProps) {
  // Action labels are shared journal copy, not module-specific text.
  const { t } = useTranslation('journal')

  return (
    <Link
      className="button"
      to={getModuleActivityPath(moduleId)}
      onClick={onNavigate}
    >
      {t(progress.status === 'complete' ? 'revisit' : 'continue')}
    </Link>
  )
}
