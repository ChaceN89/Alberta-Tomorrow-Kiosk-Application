/**
  File: Layout.tsx | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Compose the skip link, navbar, routed page, footer, and route-level overlays.

  Usage:
  - Wraps the routed pages registered in App.

  Notes:
  - None.
 */
import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'
import { Footer } from './Footer'
import { IntroTutorial } from './IntroTutorial'
import { Navbar } from './Navbar'
import { OverlayScrollbar } from './OverlayScrollbar'

export function Layout() {
  const { t } = useTranslation('global')

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Skip link for accessibility */}
      <a href="#main-content" className="skip-link">
        {t('navigation.skip')}
      </a>

      {/* Navbar for site navigation */}
      <Navbar />

      {/* main content container - has the outlet for routed pages */}
      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto w-full max-w-6xl flex-1 px-6 py-10 md:py-14"
      >
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      {/* The intro tutorial component renders the guided tutorial dialog. */}
      <IntroTutorial />

      {/* Custom overlay scrollbar component */}
      <OverlayScrollbar />
    </div>
  )
}
