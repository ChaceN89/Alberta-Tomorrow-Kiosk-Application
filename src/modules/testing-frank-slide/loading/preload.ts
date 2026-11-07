/**
  File: preload.ts | Author: Chace Nielson
  Date Created: Nov 6, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Decode the archival photographs before the Frank Slide activity is shown.

  Usage:
  - Registered as this module's optional preload hook.

  Notes:
  - Preloading errors are surfaced through the shared module loading state.
 */
import type { ModulePreloadContext } from '@/modules/types'
import frankSlideMountainArchive from '@/mapping/assets/frank-slide/frank-slide-mountain-archive.png'
import frankSlideStreetArchive from '@/mapping/assets/frank-slide/frank-slide-street-archive.png'

const frankSlideImages = [frankSlideMountainArchive, frankSlideStreetArchive]

export async function preloadFrankSlide({
  signal,
  onProgress,
}: ModulePreloadContext): Promise<void> {
  for (const [index, source] of frankSlideImages.entries()) {
    if (signal.aborted) {
      throw new DOMException('Module loading was cancelled.', 'AbortError')
    }

    const image = new Image()
    image.src = source
    await image.decode()

    if (signal.aborted) {
      throw new DOMException('Module loading was cancelled.', 'AbortError')
    }

    onProgress(Math.round(((index + 1) / frankSlideImages.length) * 100))
  }
}
