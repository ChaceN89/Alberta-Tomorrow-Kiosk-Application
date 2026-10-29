/**
  File: main.tsx | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 23, 2026

  Description:
  - Browser entry point: load translations and global styles, create the React root, and mount the app.
  - StrictMode checks development behavior; ErrorBoundary provides recovery for render failures.
  - AppStartup completes initialization and the splash transition before showing App.

  Usage:
  - Loaded by the HTML entry point to start the application in the browser.

  Notes:
  - None.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from '@/components/app-states/ErrorBoundary'
import '@/styles/global.css'
import '@/styles/spashScreen.css'
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
