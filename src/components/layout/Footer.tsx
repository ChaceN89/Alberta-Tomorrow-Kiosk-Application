/**
 * File: Footer.tsx | Author: Chace Nielson
 * Created: 2026-10-28 | Updated: 2026-10-28
 * Description: Display the application footer and link to Alberta Tomorrow.
 * Dependencies: react-i18next, global translations.
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
