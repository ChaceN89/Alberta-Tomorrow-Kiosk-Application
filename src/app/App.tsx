/**
 * File: App.tsx | Author: Chace Nielson
 * Created: 2026-10-23 | Updated: 2026-10-23
 * Description: Define routes beneath the shared application layout.
 * Dependencies: React Router, react-i18next, application pages.
 */
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { NotFound } from '../components/NotFound'
import { HomePage } from './HomePage'
import { ModulePage } from './ModulePage'
import { ModulePreloadProvider } from '../modules/ModulePreloadProvider'

export function App() {
  const { t, i18n } = useTranslation('global')
  const isDevelopment =
    import.meta.env.DEV && import.meta.env.VITE_ENVIRONMENT === 'development'

  useEffect(() => {
    document.documentElement.lang = i18n.resolvedLanguage ?? 'en'
    document.title = `${isDevelopment ? 'Dev | ' : ''}${t('app.name')}`
  }, [t, i18n.resolvedLanguage, isDevelopment])

  return (
    <BrowserRouter>
      <ModulePreloadProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="modules/:moduleId/*" element={<ModulePage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ModulePreloadProvider>
    </BrowserRouter>
  )
}
