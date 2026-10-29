/**
  File: NotFound.tsx | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 23, 2026

  Description:
  - Show a route-not-found page with a home link and Alberta fact.

  Usage:
  - Shared and app-state UI is imported by app or feature flows.

  Notes:
  - None.
 */
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { FunFact } from '@/components/shared/FunFact'

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
