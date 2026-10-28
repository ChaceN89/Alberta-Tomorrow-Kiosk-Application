/**
 * File: main.tsx | Author: Chace Nielson
 * Created: 2026-10-23 | Updated: 2026-10-28
 * Description: Initialize translations and mount the application with error recovery.
 * - main entry point for the application, responsible for initializing translations and mounting the root component.
 *
 * - StrictMode: Ensures that the application is rendered in React's strict mode, highlighting potential problems in the component tree.
 * - ErrorBoundary: Catches JavaScript errors anywhere in the child component tree and displays a fallback UI instead of crashing the whole app.
 * - AppStartup: Handles any necessary startup logic before rendering the main application component.
 *
 * Dependencies: React, React DOM, i18next, global styles.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from '../components/app-states/ErrorBoundary'
import '../styles/global.css'
import { AppStartup } from './AppStartup'
import './i18n'
import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <AppStartup>
        <App />
      </AppStartup>
    </ErrorBoundary>
  </StrictMode>,
)
