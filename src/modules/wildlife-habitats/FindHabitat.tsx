/**
  File: FindHabitat.tsx | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 23, 2026

  Description:
  - Match a woodland caribou to an Alberta habitat with instant feedback.

  Usage:
  - Registered activity components are lazy-loaded by the module registry.

  Notes:
  - None.
 */
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import type { ModuleActivityProps } from '../types'

const habitats = ['prairie', 'boreal', 'mountains'] as const
type Habitat = (typeof habitats)[number]

export default function FindHabitat({
  completeCheckpoint,
}: ModuleActivityProps) {
  const { t } = useTranslation('wildlifeFinder')
  const [selected, setSelected] = useState<Habitat | null>(null)

  useEffect(() => {
    completeCheckpoint('habitats-matter')
  }, [completeCheckpoint])

  const chooseHabitat = (habitat: Habitat) => {
    setSelected(habitat)

    if (habitat === 'boreal') {
      completeCheckpoint('caribou-home')
    }
  }

  return (
    <section aria-labelledby="activity-title" className="max-w-3xl space-y-6">
      <p className="font-semibold text-pine">{t('category')}</p>
      <h1 id="activity-title">{t('title')}</h1>
      <p className="text-lg text-muted">{t('activity.introduction')}</p>
      <div className="panel space-y-6">
        <fieldset>
          <legend className="mb-4 text-xl font-semibold">
            {t('activity.question')}
          </legend>
          <div className="grid gap-3 sm:grid-cols-3">
            {habitats.map((habitat) => (
              <button
                key={habitat}
                type="button"
                aria-pressed={selected === habitat}
                className="button-secondary"
                onClick={() => chooseHabitat(habitat)}
              >
                {t(`activity.habitats.${habitat}`)}
              </button>
            ))}
          </div>
        </fieldset>
        <p role="status" className="min-h-16 font-medium text-pine">
          {selected !== null &&
            t(selected === 'boreal' ? 'activity.correct' : 'activity.tryAgain')}
        </p>
        <button
          type="button"
          className="button-secondary"
          onClick={() => setSelected(null)}
          disabled={selected === null}
        >
          {t('activity.reset')}
        </button>
      </div>
      <Link to="/modules/wildlife-habitats" className="button">
        {t('backToOverview')}
      </Link>
    </section>
  )
}
