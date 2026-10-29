/**
  File: App.tsx | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Compose the route tree under BrowserRouter, enabling client-side navigation and deep links.
  - ExpeditionProgressProvider shares saved module progress; JournalProvider controls its UI;
  - IntroTutorialProvider manages onboarding;
  - ModulePreloadProvider tracks activity loading for each of the different module pages/module data.
  - Layout wraps home, module, and not-found routes with shared application UI.

  Usage:
  - Rendered by AppStartup after initialization succeeds.

  Notes:
  - None.
 */
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { NotFound } from '@/components/app-states/NotFound'
import { HomePage } from './pages/HomePage'
import { ModulePage } from './pages/ModulePage'
import { ModulePreloadProvider } from '@/modules/ModulePreloadProvider'
import { JournalProvider } from '@/journal/JournalProvider'
import { ExpeditionProgressProvider } from '@/save-data/ExpeditionProgressProvider'
import { IntroTutorialProvider } from '@/tutorials/intro-tutorial/IntroTutorialProvider'
import { AudioPlayerProvider } from '@/module-tools/media-player/AudioPlayerProvider'

export function App() {
  return (
    <BrowserRouter>
      <ExpeditionProgressProvider>
        <JournalProvider>
          <IntroTutorialProvider>
            <ModulePreloadProvider>
              {/* Above the routes so media keeps playing while learners navigate */}
              <AudioPlayerProvider>
                <Routes>
                  <Route element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route
                      path="modules/:moduleId/*"
                      element={<ModulePage />}
                    />
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
              </AudioPlayerProvider>
            </ModulePreloadProvider>
          </IntroTutorialProvider>
        </JournalProvider>
      </ExpeditionProgressProvider>
    </BrowserRouter>
  )
}
