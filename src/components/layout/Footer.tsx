/**
  File: Footer.tsx | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Nov 8, 2026

  Description:
  - Display the application footer and link to Alberta Tomorrow.

  Usage:
  - Layout components render in the app shell.

  Notes:
  - None.
 */
import { Trans, useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export function Footer() {
  const { t } = useTranslation('global')

  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-5 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          <Trans
            i18nKey="footer.credit"
            ns="global"
            components={{
              brandLink: (
                <a href="https://albertatomorrow.ca/" className="text-link" />
              ),
            }}
          />
        </p>
        <Link className="text-link underline underline-offset-2" to="/credits">
          {t('footer.acknowledgements')}
        </Link>
      </div>
    </footer>
  )
}
