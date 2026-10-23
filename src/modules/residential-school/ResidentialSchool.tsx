/**
 * File: ResidentialSchool.tsx | Author: Chace Nielson
 * Created: 2026-10-23 | Updated: 2026-10-23
 * Description: Present historical Alberta residential-school records respectfully.
 * Dependencies: React Router, react-i18next; sources link to NCTR archives; records journal checkpoints.
 */
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import type { ModuleActivityProps } from '../types'

export default function ResidentialSchool({
  completedCheckpoints,
  completeCheckpoint,
}: ModuleActivityProps) {
  const { t } = useTranslation('residentialSchool')
  const schools = t('activity.schools', { returnObjects: true })

  return (
    <section
      aria-labelledby="residential-school-title"
      className="max-w-4xl space-y-6"
    >
      <p className="font-semibold text-pine">{t('category')}</p>
      <p className="text-lg text-muted">{t('activity.introduction')}</p>
      <ul className="grid gap-5 md:grid-cols-2">
        {schools.map((school) => (
          <li key={school.id} className="panel space-y-3">
            <h2>{school.name}</h2>
            <p>
              <span className="font-semibold">{t('activity.location')}</span>{' '}
              {school.location}
            </p>
            <p>
              <span className="font-semibold">
                {t('activity.operatingYears')}
              </span>{' '}
              {school.operatingYears}
            </p>
            <p className="text-muted">{school.description}</p>
            <a
              href={school.source}
              target="_blank"
              rel="noreferrer"
              aria-label={t('activity.sourceLink', { name: school.name })}
              className="font-semibold text-pine underline underline-offset-4"
            >
              {t('activity.sourceLabel')}
            </a>
            <div>
              <button
                type="button"
                className="button-secondary min-h-10 px-4 py-2 text-sm"
                disabled={completedCheckpoints.includes(school.id)}
                aria-label={t(
                  completedCheckpoints.includes(school.id)
                    ? 'activity.addedToJournalLabel'
                    : 'activity.addToJournalLabel',
                  { name: school.name },
                )}
                onClick={() => completeCheckpoint(school.id)}
              >
                {t(
                  completedCheckpoints.includes(school.id)
                    ? 'activity.addedToJournal'
                    : 'activity.addToJournal',
                )}
              </button>
            </div>
          </li>
        ))}
      </ul>
      <Link to="/modules/residential-school" className="button">
        {t('backToOverview')}
      </Link>
    </section>
  )
}
