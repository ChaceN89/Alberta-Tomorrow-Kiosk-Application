/**
 * File: WildlifeHabitats.tsx | Author: Chace Nielson
 * Created: 2026-10-23 | Updated: 2026-10-23
 * Description: Match a woodland caribou to an Alberta habitat with instant feedback.
 * Dependencies: React state, React Router, react-i18next; no saved progress.
 */
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const habitats = ['prairie', 'boreal', 'mountains'] as const
type Habitat = (typeof habitats)[number]

export default function WildlifeHabitats() {
  const { t } = useTranslation()
  const [selected, setSelected] = useState<Habitat | null>(null)

  return (
    <section aria-labelledby="activity-title" className="max-w-3xl space-y-6">
      <p className="font-semibold text-pine">{t('categories.wildlife')}</p>
      <h1 id="activity-title">{t('modules.wildlifeHabitats.title')}</h1>
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
                onClick={() => setSelected(habitat)}
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
      <Link to="/" className="button">
        {t('navigation.returnHome')}
      </Link>
    </section>
  )
}
