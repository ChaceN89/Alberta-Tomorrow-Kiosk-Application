/**
  File: AppStartup.tsx | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Mount routed content behind the splash and wait for app-wide and map startup readiness.
  - Mount global overlays (developer tools, toasts) only after startup is ready.
  - Show an error screen when initialization fails and allow retrying with a fresh initialization.

  Usage:
  - Wraps routed content inside App and keeps the splash in front until startup completes.

  Notes:
  - Map routes register a startup dependency and signal readiness after map setup.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { ErrorScreen } from '@/components/app-states/ErrorScreen'
import { SplashScreen } from '@/components/app-states/SplashScreen'
import { AppStartupMapContext } from './AppStartupMapContext'
import { initializeApp } from './initializeApp'

//
type StartupState = 'loading' | 'exiting' | 'ready' | 'error'

// props for the AppStartup component -
type AppStartupProps = {
  children: ReactNode
  // Mounted only once startup is ready.
  overlays?: ReactNode
}

// Duration for the splash screen fade-out animation. In milliseconds.
const SPLASH_FADE_DURATION_MS = 250
const MAP_STARTUP_TIMEOUT_MS = 20_000

export function AppStartup({ children, overlays }: AppStartupProps) {
  const [state, setState] = useState<StartupState>('loading') // initial startup state - loading
  const [retryCount, setRetryCount] = useState(0) // number of initialization retries attempted
  const initializationRef = useRef<Promise<void> | null>(null)
  const mapRequiredRef = useRef(false)
  const mapReadyPromiseRef = useRef<Promise<void> | null>(null)
  const resolveMapReadyRef = useRef<(() => void) | null>(null)

  const setMapRequired = useCallback((isRequired: boolean) => {
    mapRequiredRef.current = isRequired

    if (isRequired) {
      mapReadyPromiseRef.current = new Promise<void>((resolve) => {
        resolveMapReadyRef.current = resolve
      })
      return
    }

    resolveMapReadyRef.current?.()
    resolveMapReadyRef.current = null
    mapReadyPromiseRef.current = null
  }, [])

  const markMapReady = useCallback(() => {
    resolveMapReadyRef.current?.()
    resolveMapReadyRef.current = null
  }, [])

  const mapGate = useMemo(
    () => ({ setMapRequired, markMapReady }),
    [markMapReady, setMapRequired],
  )

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
      .then(async () => {
        if (!isActive) return // This effect has been cleaned up.

        if (mapRequiredRef.current && mapReadyPromiseRef.current) {
          let timeoutTimer: number | undefined

          try {
            await Promise.race([
              mapReadyPromiseRef.current,
              new Promise<void>((_, reject) => {
                timeoutTimer = window.setTimeout(
                  () =>
                    reject(
                      new Error(
                        'The map did not become ready before startup timed out.',
                      ),
                    ),
                  MAP_STARTUP_TIMEOUT_MS,
                )
              }),
            ])
          } finally {
            if (timeoutTimer !== undefined) window.clearTimeout(timeoutTimer)
          }
        }

        if (!isActive) return

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

  return (
    <AppStartupMapContext.Provider value={mapGate}>
      <>
        {children}
        {state === 'ready' ? (
          overlays
        ) : (
          <SplashScreen isExiting={state === 'exiting'} />
        )}
      </>
    </AppStartupMapContext.Provider>
  )
}
