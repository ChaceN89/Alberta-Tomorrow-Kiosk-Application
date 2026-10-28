/**
 * File: ModuleNotFound.tsx | Author: Chace Nielson
 * Created: 2026-10-23 | Updated: 2026-10-28
 * Description: Explain when a requested learning module cannot be found.
 * Dependencies: React Router and the global i18next namespace.
 */
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export function ModuleNotFound() {
  const { t } = useTranslation('global')

  return (
    <section className="panel max-w-2xl space-y-5">
      <h1>{t('moduleNotFound.title')}</h1>
      <p>{t('moduleNotFound.description')}</p>
      <Link to="/" className="button">
        {t('navigation.returnHome')}
      </Link>
    </section>
  )
}
