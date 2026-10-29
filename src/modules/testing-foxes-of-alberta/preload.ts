/**
  File: preload.ts | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Download and cache all local audio used by the Alberta foxes test module.

  Usage:
  - Registered as this module's optional preload hook.

  Notes:
  - This intentionally preloads the test module's audio to demonstrate media readiness.
    Preloading all audio is not generally recommended for production modules.
 */
import type { ModulePreloadContext } from '@/modules/types'
import { cachePreloadedFoxAudio } from './audioCache'
import { foxesOfAlbertaTracks } from './tracks'

export async function preloadFoxesOfAlberta({
  signal,
  onProgress,
}: ModulePreloadContext): Promise<void> {
  const sources = [...new Set(foxesOfAlbertaTracks.map((track) => track.src))]
  const assets: { source: string; blob: Blob }[] = []

  for (const [index, source] of sources.entries()) {
    if (signal.aborted) {
      throw new DOMException('Module loading was cancelled.', 'AbortError')
    }

    const response = await fetch(source, { signal })

    if (!response.ok) {
      throw new Error(
        `Failed to preload fox audio "${source}" (${response.status}).`,
      )
    }

    assets.push({ source, blob: await response.blob() })
    onProgress(Math.round(((index + 1) / sources.length) * 100))
  }

  if (signal.aborted) {
    throw new DOMException('Module loading was cancelled.', 'AbortError')
  }

  cachePreloadedFoxAudio(assets)
}
