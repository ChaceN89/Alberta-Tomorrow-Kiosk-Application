/**
  File: Layout.tsx | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Compose the skip link, navbar, routed page, footer, and global overlays.

  Usage:
  - Wraps the routed pages registered in App.

  Notes:
  - None.
 */
import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'
import { AudioPlayerPanel } from '@/module-tools/media-player/AudioPlayerPanel'
import { DisplayTesting } from '@/components/development/dev-tools/DisplayTesting'
import { MyToasters } from '@/components/toasts/MyToasters'
import { Footer } from './Footer'
import { IntroTutorial } from './IntroTutorial'
import { JournalModal } from '@/journal/components/JournalModal'
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

      {/* Footer and global overlays */}
      <Footer />

      {/* Development and global overlay components - doens't render if in production */}
      <DisplayTesting />

      {/* the modal component  */}
      <JournalModal />

      {/* The intro tutorial component renders the guided tutorial dialog. */}
      <IntroTutorial />

      {/* Corner media player shared by every module tool */}
      <AudioPlayerPanel />

      {/* Custom overlay scrollbar component */}
      <OverlayScrollbar />

      {/* Separate containers for progress/status and user notifications */}
      <MyToasters />
    </div>
  )
}
