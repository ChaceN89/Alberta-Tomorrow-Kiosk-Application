/**
  File: AppStartup.tsx | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Gate routed content and the global overlays (developer tools, toasts) on app-wide initialization.
  - Show an error screen when initialization fails and allow retrying with a fresh initialization.

  Usage:
  - Wraps routed content inside App until initialization and the splash transition finish.

  Notes:
  - None.
 */
import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { ErrorScreen } from '@/components/app-states/ErrorScreen'
import { SplashScreen } from '@/components/app-states/SplashScreen'
import { initializeApp } from './initializeApp'

//
type StartupState = 'loading' | 'exiting' | 'ready' | 'error'

// props for the AppStartup component -
type AppStartupProps = {
  children: ReactNode
  // Mounted only once startup is ready, so the splash screen stays in front.
  overlays?: ReactNode
}

// Duration for the splash screen fade-out animation. In milliseconds.
const SPLASH_FADE_DURATION_MS = 250

export function AppStartup({ children, overlays }: AppStartupProps) {
  const [state, setState] = useState<StartupState>('loading') // initial startup state - loading
  const [retryCount, setRetryCount] = useState(0) // number of initialization retries attempted
  const initializationRef = useRef<Promise<void> | null>(null)

  // Handle retrying initialization by clearing the current promise and resetting state. - should never actaul occur if initialization succeeds on the first attempt
  // This allows the user to attempt initialization again if it previously failed.
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
  if (state === 'ready') {
    return (
      <>
        {children}
        {overlays}
      </>
    )
  }

  // otherwise, show the splash screen (loading or exiting) no error yet and/or not ready
  return (
    <>
      {state === 'exiting' && children}
      <SplashScreen isExiting={state === 'exiting'} />
    </>
  )
}
