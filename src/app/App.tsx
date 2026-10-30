/**
  File: App.tsx | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Compose the route tree under BrowserRouter, enabling client-side navigation and deep links.
  - ExpeditionProgressProvider shares saved module progress; JournalProvider controls its UI;
  - IntroTutorialProvider manages onboarding;
  - ModulePreloadProvider tracks activity loading for each of the different module pages/module data.
  - Map routes mount behind the AppStartup splash; global overlays mount after startup is ready.

  Usage:
  - Rendered by main.tsx as the root of the routed application.

  Notes:
  - None.
 */
import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { NotFound } from '@/components/app-states/NotFound'
import { ErrorBoundary } from '@/components/app-states/ErrorBoundary'
import { Loading } from '@/components/app-states/Loading'
import { GlobalOverlayLayer } from '@/components/toasts/GlobalOverlayLayer'
import { JournalModal } from '@/journal/components/JournalModal'
import { HomePage } from './pages/HomePage'
import { ModulePage } from './pages/ModulePage'
import { AudioPlayerPanel } from '@/module-tools/media-player/components/AudioPlayerPanel'
import { AppStartup } from './AppStartup'
import { useAppStartupMapGate } from './AppStartupMapContext'
import { ModulePreloadProvider } from '@/modules/ModulePreloadProvider'
import { JournalProvider } from '@/journal/JournalProvider'
import { ExpeditionProgressProvider } from '@/save-data/ExpeditionProgressProvider'
import { IntroTutorialProvider } from '@/tutorials/intro-tutorial/IntroTutorialProvider'
import { AudioPlayerProvider } from '@/module-tools/media-player/provider/AudioPlayerProvider'
import { MediaViewerProvider } from '@/module-tools/media-viewer/provider/MediaViewerProvider'
import { MapInfoPanelProvider } from '@/module-tools/map-info-panel/provider/MapInfoPanelProvider'

const ExploreMap = lazy(() =>
  import('./pages/ExploreMap').then(({ ExploreMap }) => ({
    default: ExploreMap,
  })),
)

function ExploreMapRoute() {
  const mapGate = useAppStartupMapGate()

  useEffect(() => {
    mapGate?.setMapRequired(true)
    return () => mapGate?.setMapRequired(false)
  }, [mapGate])

  return (
    <Suspense fallback={<Loading />}>
      <ExploreMap />
    </Suspense>
  )
}

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
                    <MapInfoPanelProvider>
                      <AppStartup overlays={<GlobalOverlayLayer />}>
                        <>
                          <Routes>
                            <Route
                              path="explore"
                              element={<ExploreMapRoute />}
                            />
                            <Route
                              path="expeditions/:moduleId/explore"
                              element={<ExploreMapRoute />}
                            />
                            <Route
                              path="expeditions/:moduleId/activity/explore"
                              element={<ExploreMapRoute />}
                            />
                            <Route element={<Layout />}>
                              <Route index element={<HomePage />} />
                              <Route
                                path="expeditions/modules/*"
                                element={<NotFound />}
                              />
                              <Route
                                path="expeditions/:moduleId/*"
                                element={<ModulePage />}
                              />
                              <Route path="*" element={<NotFound />} />
                            </Route>
                          </Routes>
                          <AudioPlayerPanel />
                        </>
                      </AppStartup>
                    </MapInfoPanelProvider>
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
