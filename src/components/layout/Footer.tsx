/**
  File: Footer.tsx | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Display the application footer and link to Alberta Tomorrow.

  Usage:
  - Layout components render in the app shell.

  Notes:
  - None.
 */
import { Trans } from 'react-i18next'

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-5 text-sm text-muted">
        <Trans
          i18nKey="footer.credit"
          ns="global"
          components={{
            brandLink: (
              <a href="https://albertatomorrow.ca/" className="text-link" />
            ),
          }}
        />
      </div>
    </footer>
  )
}
