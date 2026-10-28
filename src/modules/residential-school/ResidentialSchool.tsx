/**
  File: ResidentialSchool.tsx | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 23, 2026

  Description:
  - Present historical Alberta residential-school records respectfully.

  Usage:
  - Registered activity components are lazy-loaded by the module registry.

  Notes:
  - None.
 */
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import type { ModuleActivityProps } from '../types'

export default function ResidentialSchool({
  completedCheckpoints,
  completeCheckpoint,
}: ModuleActivityProps) {
  const { t } = useTranslation('residentialSchool')
  const schools = t('activity.schools', { returnObjects: true })
  // Schools whose archive record has been opened this visit.
  const [openedRecords, setOpenedRecords] = useState<ReadonlySet<string>>(
    () => new Set(),
  )

  const markRecordOpened = (schoolId: string) => {
    setOpenedRecords((current) => new Set(current).add(schoolId))
  }

  return (
    <section
      aria-labelledby="residential-school-title"
      className="max-w-4xl space-y-6"
    >
      <p className="font-semibold text-pine">{t('category')}</p>
      <p className="text-lg text-muted">{t('activity.introduction')}</p>
      <ul className="grid gap-5 md:grid-cols-2">
        {schools.map((school) => {
          const isAdded = completedCheckpoints.includes(school.id)
          const canAdd = openedRecords.has(school.id)
          const hintId = `journal-hint-${school.id}`

          return (
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
              <div className="space-y-4 pt-2">
                <a
                  href={school.source}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={t('activity.sourceLink', { name: school.name })}
                  className="inline-block font-semibold text-pine underline underline-offset-4"
                  onClick={() => markRecordOpened(school.id)}
                  onAuxClick={() => markRecordOpened(school.id)}
                >
                  {t('activity.sourceLabel')}
                </a>
                <div className="space-y-2">
                  <button
                    type="button"
                    className="button-secondary min-h-10 px-4 py-2 text-sm"
                    disabled={isAdded || !canAdd}
                    aria-describedby={!isAdded && !canAdd ? hintId : undefined}
                    aria-label={t(
                      isAdded
                        ? 'activity.addedToJournalLabel'
                        : 'activity.addToJournalLabel',
                      { name: school.name },
                    )}
                    onClick={() => completeCheckpoint(school.id)}
                  >
                    {t(
                      isAdded
                        ? 'activity.addedToJournal'
                        : 'activity.addToJournal',
                    )}
                  </button>
                  {!isAdded && !canAdd && (
                    <p id={hintId} className="text-sm text-muted">
                      {t('activity.addToJournalHint')}
                    </p>
                  )}
                </div>
              </div>
            </li>
          )
        })}
      </ul>
      <Link to="/modules/residential-school" className="button">
        {t('backToOverview')}
      </Link>
    </section>
  )
}
