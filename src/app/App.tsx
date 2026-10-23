/**
 * File: App.tsx | Author: Chace Nielson
 * Created: 2026-10-23 | Updated: 2026-10-23
 * Description: Define routes beneath the shared application layout.
 * Dependencies: React Router, application pages and providers.
 */
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { NotFound } from '../components/NotFound'
import { HomePage } from './HomePage'
import { ModulePage } from './ModulePage'
import { ModulePreloadProvider } from '../modules/ModulePreloadProvider'
import { JournalProvider } from '../journal/JournalProvider'
import { IntroTourProvider } from '../tour/IntroTourProvider'

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
