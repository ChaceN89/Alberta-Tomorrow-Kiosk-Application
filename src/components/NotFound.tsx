/**
 * File: NotFound.tsx | Author: Chace Nielson
 * Created: 2026-10-23 | Updated: 2026-10-23
 * Description: Give lost visitors a playful route home and an Alberta fact.
 * Dependencies: React Router, react-i18next, FunFact.
 */
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { FunFact } from './FunFact'

export function NotFound() {
  const { t } = useTranslation('global')

  return (
    <section
      aria-labelledby="not-found-title"
      className="mx-auto grid min-h-[55dvh] max-w-xl content-center gap-5"
    >
      <div className="panel space-y-5 text-center">
        <p
          aria-hidden="true"
          className="text-7xl leading-none font-black text-pine/25"
        >
          404
        </p>
        <h1 id="not-found-title">{t('notFound.title')}</h1>
        <p className="text-muted">{t('notFound.description')}</p>
        <Link to="/" className="button">
          {t('notFound.backToAlberta')}
        </Link>
      </div>
      <FunFact />
    </section>
  )
}
