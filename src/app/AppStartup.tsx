/**
 * File: AppStartup.tsx | Author: Chace Nielson
 * Created: 2026-10-23 | Updated: 2026-10-28
 * Description: Coordinate app initialization, splash transitions, and retries.
 * Dependencies: React, react-i18next, initializeApp, SplashScreen.
 */
import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { SplashScreen } from '../components/app-states/SplashScreen'
import { initializeApp } from './initializeApp'

//
type StartupState = 'loading' | 'exiting' | 'ready' | 'error'

// props for the AppStartup component -
type AppStartupProps = {
  children: ReactNode
}

// Duration for the splash screen fade-out animation. In milliseconds.
const SPLASH_FADE_DURATION_MS = 250

export function AppStartup({ children }: AppStartupProps) {
  const { t } = useTranslation('global') // translation function for global namespace
  const [state, setState] = useState<StartupState>('loading') // initial startup state - loading
  const [retryCount, setRetryCount] = useState(0) // number of initialization retries attempted
  const initializationRef = useRef<Promise<void> | null>(null)

  useEffect(() => {
    let isActive = true
    let fadeTimer: number | undefined

    initializationRef.current ??= initializeApp()
    void initializationRef.current
      .then(() => {
        if (!isActive) return

        setState('exiting')
        fadeTimer = window.setTimeout(() => {
          if (isActive) setState('ready')
        }, SPLASH_FADE_DURATION_MS)
      })
      .catch((error: unknown) => {
        if (!isActive) return

        console.error('Application initialization failed.', error)
        setState('error')
      })

    return () => {
      isActive = false
      if (fadeTimer !== undefined) window.clearTimeout(fadeTimer)
    }
  }, [retryCount])

  if (state === 'error') {
    return (
      <main className="grid min-h-dvh place-items-center bg-canvas p-6">
        <section role="alert" className="panel w-full max-w-lg text-center">
          <h1>{t('app.startupErrorTitle')}</h1>
          <p className="my-4 text-muted">{t('app.startupErrorDescription')}</p>
          <button
            type="button"
            className="button"
            onClick={() => {
              initializationRef.current = null
              setState('loading')
              setRetryCount((count) => count + 1)
            }}
          >
            {t('app.retry')}
          </button>
        </section>
      </main>
    )
  }

  if (state === 'ready') return children

  return (
    <>
      {state === 'exiting' && children}
      <SplashScreen isExiting={state === 'exiting'} />
    </>
  )
}
