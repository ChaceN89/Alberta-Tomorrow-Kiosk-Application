/**
 * File: NotFound.tsx | Author: Chace Nielson
 * Created: 2026-10-23 | Updated: 2026-10-23
 * Description: Offer a friendly recovery for unknown routes and module IDs.
 * Dependencies: React Router, react-i18next.
 */
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export function NotFound() {
  const { t } = useTranslation()

  return (
    <section className="panel max-w-2xl space-y-5">
      <h1>{t('notFound.title')}</h1>
      <p>{t('notFound.description')}</p>
      <Link to="/" className="button">
        {t('navigation.returnHome')}
      </Link>
    </section>
  )
}
