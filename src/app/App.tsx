/**
 * File: App.tsx | Author: Chace Nielson
 * Created: 2026-10-23 | Updated: 2026-10-28
 * Description: Define routes beneath the shared application layout.
 *
 * Features:
 * - Browser router: Provides routing capabilities for the application.
 * - Journal provider: Manages journal state and data.
 * - Intro tour provider: Manages the introductory tour for new users.
 * - Module preload provider: Preloads module data for improved performance.
 * - Router and Layout: Defines the routing structure and wraps routes with a consistent layout.
 */
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from '../components/layout/Layout'
import { NotFound } from '../components/app-states/NotFound'
import { HomePage } from './pages/HomePage'
import { ModulePage } from './pages/ModulePage'
import { ModulePreloadProvider } from '../modules/ModulePreloadProvider'
import { JournalProvider } from '../journal/JournalProvider'
import { IntroTourProvider } from '../introTour/IntroTourProvider'

export function App() {
  return (
    <BrowserRouter>
      <JournalProvider>
        <IntroTourProvider>
          <ModulePreloadProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="modules/:moduleId/*" element={<ModulePage />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </ModulePreloadProvider>
        </IntroTourProvider>
      </JournalProvider>
    </BrowserRouter>
  )
}
