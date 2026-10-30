/**
  File: App.tsx | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Compose the route tree under BrowserRouter, enabling client-side navigation and deep links.
  - ExpeditionProgressProvider shares saved module progress; JournalProvider controls its UI;
  - IntroTutorialProvider manages onboarding;
  - ModulePreloadProvider tracks activity loading for each of the different module pages/module data.
  - AppStartup gates route rendering; the global overlays mount once startup is ready.

  Usage:
  - Rendered by main.tsx as the root of the routed application.

  Notes:
  - None.
 */
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { NotFound } from '@/components/app-states/NotFound'
import { ErrorBoundary } from '@/components/app-states/ErrorBoundary'
import { GlobalOverlayLayer } from '@/components/toasts/GlobalOverlayLayer'
import { JournalModal } from '@/journal/components/JournalModal'
import { HomePage } from './pages/HomePage'
import { ModulePage } from './pages/ModulePage'
import { ExploreMap } from './pages/ExploreMap'
import { AudioPlayerPanel } from '@/module-tools/media-player/components/AudioPlayerPanel'
import { AppStartup } from './AppStartup'
import { ModulePreloadProvider } from '@/modules/ModulePreloadProvider'
import { JournalProvider } from '@/journal/JournalProvider'
import { ExpeditionProgressProvider } from '@/save-data/ExpeditionProgressProvider'
import { IntroTutorialProvider } from '@/tutorials/intro-tutorial/IntroTutorialProvider'
import { AudioPlayerProvider } from '@/module-tools/media-player/provider/AudioPlayerProvider'
import { MediaViewerProvider } from '@/module-tools/media-viewer/provider/MediaViewerProvider'

export function App() {
  return (
    <BrowserRouter>
      <ExpeditionProgressProvider>
        <JournalProvider>
          <IntroTutorialProvider>
            <ModulePreloadProvider>
              {/* Above the routes so media keeps playing while learners navigate */}
              <AudioPlayerProvider>
                <MediaViewerProvider>
                  <ErrorBoundary>
                    <AppStartup overlays={<GlobalOverlayLayer />}>
                      <>
                        <Routes>
                          <Route path="explore" element={<ExploreMap />} />
                          <Route
                            path="expeditions/modules/:moduleId/explore"
                            element={<ExploreMap />}
                          />
                          <Route element={<Layout />}>
                            <Route index element={<HomePage />} />
                            <Route
                              path="expeditions/modules/:moduleId/*"
                              element={<ModulePage />}
                            />
                            <Route path="*" element={<NotFound />} />
                          </Route>
                        </Routes>
                        <AudioPlayerPanel />
                      </>
                    </AppStartup>
                  </ErrorBoundary>
                  <JournalModal />
                </MediaViewerProvider>
              </AudioPlayerProvider>
            </ModulePreloadProvider>
          </IntroTutorialProvider>
        </JournalProvider>
      </ExpeditionProgressProvider>
    </BrowserRouter>
  )
}
