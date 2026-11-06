/**
  File: preload.ts | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 23, 2026

  Description:
  - Simulate an abortable preload for the residential-school activity.

  Usage:
  - Registered as the module's optional preload hook.

  Notes:
  - None.
 */
import type { ModulePreloadContext } from '@/modules/types'

const FAKE_PRELOAD_DURATION_MS = 2_000
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
