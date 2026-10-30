/**
  File: main.tsx | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Browser entry point: load translations and global styles, create the React root, and mount the app.
  - StrictMode checks development behavior; App owns startup and render recovery.
  - Global development tools remain mounted above the startup splash.

  Usage:
  - Loads translations and styles before mounting App in the browser.

  Notes:
  - None.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/global.css'
import '@/styles/mapping.css'
import '@/styles/spashScreen.css'
import './i18n'
import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
