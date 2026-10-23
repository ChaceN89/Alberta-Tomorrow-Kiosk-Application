/**
 * File: preloadResidentialSchool.ts | Author: Chace Nielson
 * Created: 2026-10-23 | Updated: 2026-10-23
 * Description: Simulate a cancellable residential-school activity preload.
 * Dependencies: AbortSignal and module preload progress callback.
 */
import type { ModulePreloadContext } from '../types'

const FAKE_PRELOAD_DURATION_MS = 5_000
const PROGRESS_INTERVAL_MS = 100

export function preloadResidentialSchool({
  signal,
  onProgress,
}: ModulePreloadContext) {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException('Module loading was cancelled.', 'AbortError'))
      return
    }

    const startedAt = Date.now()
    let intervalId = 0
    let timeoutId = 0

    const cleanup = () => {
      window.clearInterval(intervalId)
      window.clearTimeout(timeoutId)
      signal.removeEventListener('abort', handleAbort)
    }

    const handleAbort = () => {
      cleanup()
      reject(new DOMException('Module loading was cancelled.', 'AbortError'))
    }

    intervalId = window.setInterval(() => {
      const elapsed = Date.now() - startedAt
      onProgress(
        Math.min(95, Math.floor((elapsed / FAKE_PRELOAD_DURATION_MS) * 95)),
      )
    }, PROGRESS_INTERVAL_MS)

    timeoutId = window.setTimeout(() => {
      cleanup()
      onProgress(100)
      resolve()
    }, FAKE_PRELOAD_DURATION_MS)

    signal.addEventListener('abort', handleAbort, { once: true })

    if (signal.aborted) {
      handleAbort()
    }
  })
}
