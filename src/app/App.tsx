/**
  File: App.tsx | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Nov 6, 2026

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
import type { ReactNode } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { NotFound } from '@/components/app-states/NotFound'
import { ErrorBoundary } from '@/components/app-states/ErrorBoundary'
import { Loading } from '@/components/app-states/Loading'
import { SplashScreen } from '@/components/app-states/SplashScreen'
import { GlobalOverlayLayer } from '@/components/toasts/GlobalOverlayLayer'
import { JournalModal } from '@/journal/journal-ui/JournalModal'
import { HomePage } from './pages/HomePage'
import { ModulePage } from './pages/ModulePage'
import { AcknowledgementsPage } from './pages/AcknowledgementsPage'
import { AudioPlayerPanel } from '@/module-tools/media-player/components/AudioPlayerPanel'
import { AppStartup } from './AppStartup'
import { useAppStartupMapGate } from './AppStartupMapContext'
import { ModulePreloadProvider } from '@/modules/ModulePreloadProvider'
import { JournalProvider } from '@/journal/context/JournalProvider'
import { useJournal } from '@/journal/context/useJournal'
import { ExpeditionProgressProvider } from '@/save-data/expedition-progress'
import { IntroTutorialProvider } from '@/tutorials/specific-tutorials/intro-tutorial/IntroTutorialProvider'
import { AudioPlayerProvider } from '@/module-tools/media-player/provider/AudioPlayerProvider'
import { useAudioPlayer } from '@/module-tools/media-player/hooks/useAudioPlayer'
import { MediaViewerProvider } from '@/module-tools/media-viewer/provider/MediaViewerProvider'
import { useMediaViewer } from '@/module-tools/media-viewer/hooks/useMediaViewer'
import { MapInfoPanelProvider } from '@/module-tools/map-info-panel/provider/MapInfoPanelProvider'

const ExploreMap = lazy(() =>
  import('./pages/ExploreMap').then(({ ExploreMap }) => ({
    default: ExploreMap,
  })),
)

const DeveloperPage = lazy(() =>
  import('@/components/development/developer-page/DeveloperPage').then(
    ({ DeveloperPage }) => ({ default: DeveloperPage }),
  ),
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

function AppRouteContent({ children }: { children: ReactNode }) {
  const { isOpen: isJournalOpen } = useJournal()
  const { isOpen: isMediaViewerOpen } = useMediaViewer()
  const { isFullscreen: isPlayerFullscreen } = useAudioPlayer()

  return (
    <div inert={isJournalOpen || isMediaViewerOpen || isPlayerFullscreen}>
      {children}
    </div>
  )
}

export function App() {
  return (
    <BrowserRouter>
      <ExpeditionProgressProvider fallback={<SplashScreen isExiting={false} />}>
        <JournalProvider>
          <IntroTutorialProvider>
            <ModulePreloadProvider>
              {/* Above the routes so media keeps playing while learners navigate */}
              <AudioPlayerProvider>
                <MediaViewerProvider>
                  <ErrorBoundary>
                    <MapInfoPanelProvider>
                      <AppStartup
                        overlays={
                          <GlobalOverlayLayer
                            mediaPlayer={<AudioPlayerPanel />}
                          />
                        }
                      >
                        <AppRouteContent>
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
                                path="credits"
                                element={<AcknowledgementsPage />}
                              />
                              <Route
                                path="developer-page"
                                element={
                                  import.meta.env.VITE_ENVIRONMENT ===
                                  'development' ? (
                                    <Suspense fallback={<Loading />}>
                                      <DeveloperPage />
                                    </Suspense>
                                  ) : (
                                    <NotFound />
                                  )
                                }
                              />
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
                        </AppRouteContent>
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
