/**
 * File: ModuleCard.tsx | Author: Chace Nielson
 * Created: 2026-10-28 | Updated: 2026-10-28
 * Description: Show expedition details, progress, and actions in the home list.
 * Dependencies: react-i18next, React Router, journal context, module registry.
 */
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useJournal } from '../../journal/useJournal'
import { modules } from '../../modules/registry'
import { ExpeditionPeak, ExpeditionStatusText } from './ExpeditionPeak'

type ModuleCardProps = {
  module: (typeof modules)[number]
}

export function ModuleCard({ module }: ModuleCardProps) {
  const { t: tModule } = useTranslation(module.translationNamespace)
  const { t: tHome } = useTranslation('home')
  const { t: tJournal } = useTranslation('journal')
  const { getExpeditionProgress, openJournal } = useJournal()
  const progress = getExpeditionProgress(module)
  const title = tModule('title')

  return (
    <li className="panel flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-wrap gap-3 text-sm font-semibold text-pine">
          <span>{tModule('category')}</span>
          <span>
            {tHome('moduleDuration', { count: module.estimatedMinutes })}
          </span>
        </div>
        <ExpeditionPeak progress={progress} className="size-12" />
      </div>
      <h2>{title}</h2>
      <p className="grow text-muted">{tModule('description')}</p>
      <p className="text-sm font-semibold text-muted">
        <ExpeditionStatusText progress={progress} />
      </p>
      <div className="flex flex-wrap gap-3">
        <Link className="button" to={`/modules/${module.id}`}>
          {tHome('exploreModule')}
        </Link>
        {progress.status !== 'notStarted' && (
          <button
            type="button"
            className="button-secondary"
            aria-label={tJournal('viewJournalFor', { title })}
            onClick={() => openJournal(module.id)}
          >
            {tJournal('viewJournal')}
          </button>
        )}
      </div>
    </li>
  )
}
