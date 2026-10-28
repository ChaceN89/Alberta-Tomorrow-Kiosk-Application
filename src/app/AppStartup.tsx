/**
 * File: AppStartup.tsx | Author: Chace Nielson
 * Created: 2026-10-23 | Updated: 2026-10-28
 * Description: Coordinate app initialization, splash transitions, and retries.
 *
 * Dependencies: React, initializeApp, app-state screens.
 */
import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { ErrorScreen } from '../components/app-states/ErrorScreen'
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
  const [state, setState] = useState<StartupState>('loading') // initial startup state - loading
  const [retryCount, setRetryCount] = useState(0) // number of initialization retries attempted
  const initializationRef = useRef<Promise<void> | null>(null)

  const handleRetry = () => {
    initializationRef.current = null
    setState('loading')
    setRetryCount((count) => count + 1)
  }

  // Run initialization on mount and after each retry, then fade out the splash screen on success.
  useEffect(() => {
    let isActive = true
    let fadeTimer: number | undefined

    // Reuse the initialization promise across effect reruns until a retry clears it.
    initializationRef.current ??= initializeApp()
    void initializationRef.current
      .then(() => {
        if (!isActive) return // This effect has been cleaned up.

        setState('exiting')
        fadeTimer = window.setTimeout(() => {
          if (isActive) setState('ready')
        }, SPLASH_FADE_DURATION_MS)
      })
      .catch((error: unknown) => {
        if (!isActive) return

        console.error('Application initialization failed.', error)
        setState('error') // failure leads to error state
      })

    // Before rerunning or unmounting, ignore pending callbacks and clear the fade timer.
    return () => {
      isActive = false
      if (fadeTimer !== undefined) window.clearTimeout(fadeTimer)
    }
  }, [retryCount])

  // if in error show the error screen component
  if (state === 'error') {
    return <ErrorScreen onRetry={handleRetry} />
  }

  // if ready return the children
  if (state === 'ready') return children

  // otherwise, show the splash screen (loading or exiting) no error yet and/or not ready
  return (
    <>
      {state === 'exiting' && children}
      <SplashScreen isExiting={state === 'exiting'} />
    </>
  )
}
