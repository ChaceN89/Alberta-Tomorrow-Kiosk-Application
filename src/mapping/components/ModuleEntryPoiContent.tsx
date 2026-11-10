/**
  File: ModuleEntryPoiContent.tsx | Author: Chace Nielson
  Date Created: Nov 9, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Show expedition details and saved progress at a module's map entry point.

  Usage:
  - Supplied as information content by useMapPoiData.

  Notes:
  - Opening details does not start the expedition; entering its map does.
 */
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import type { LearningModule } from '@/modules/types'
import { getModuleExplorePath } from '@/modules/routes'
import { useExpeditionProgress } from '@/save-data/expedition-progress'
import { ExpeditionStatusText } from '@/components/modules/ExpeditionPeak'
import { useMapInfoPanel } from '@/module-tools/map-info-panel/hooks/useMapInfoPanel'

export function ModuleEntryPoiContent({ module }: { module: LearningModule }) {
  const { t } = useTranslation('mapping')
  const { t: tModule } = useTranslation(module.translationNamespace)
  const { getExpeditionProgress } = useExpeditionProgress()
  const { closePanel } = useMapInfoPanel()
  const progress = getExpeditionProgress(module)
  const ModuleIcon = module.icon
  const title = tModule(module.titleKey)
  const expeditionTitle = t('moduleEntry.title', { name: title })

  return (
    <div className="space-y-4">
      <h2 className="flex items-center gap-3">
        <ModuleIcon className="size-8 shrink-0 text-pine" />
        {expeditionTitle}
      </h2>
      <p>{tModule(module.descriptionKey)}</p>
      <p className="text-sm font-semibold text-muted">
        <ExpeditionStatusText progress={progress} />
      </p>
      <Link
        className="button min-h-12"
        to={getModuleExplorePath(module.id)}
        onClick={() => closePanel({ restoreFocus: false })}
      >
        {t(
          progress.status === 'notStarted'
            ? 'moduleEntry.start'
            : 'moduleEntry.open',
          { name: title },
        )}
      </Link>
    </div>
  )
}
