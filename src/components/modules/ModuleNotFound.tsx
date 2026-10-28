/**
  File: ModuleNotFound.tsx | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 23, 2026

  Description:
  - Explain when a requested learning module cannot be found.

  Usage:
  - Module shared UI is used by module pages.

  Notes:
  - None.
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
