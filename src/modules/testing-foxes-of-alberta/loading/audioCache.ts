/**
  File: audioCache.ts | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Keep preloaded fox audio available through in-memory object URLs.

  Usage:
  - The fox preload hook caches downloaded blobs; audio controls resolve sources here.

  Notes:
  - Object URLs remain available for the lifetime of the browser page.
 */
const preloadedAudioSources = new Map<string, string>()

export function getPreloadedFoxAudioSource(source: string): string {
  return preloadedAudioSources.get(source) ?? source
}

export function cachePreloadedFoxAudio(
  assets: readonly { source: string; blob: Blob }[],
) {
  const cachedAssets: { source: string; objectUrl: string }[] = []

  try {
    for (const { source, blob } of assets) {
      if (preloadedAudioSources.has(source)) continue

      cachedAssets.push({
        source,
        objectUrl: URL.createObjectURL(blob),
      })
    }

    for (const { source, objectUrl } of cachedAssets) {
      preloadedAudioSources.set(source, objectUrl)
    }
  } catch (error) {
    for (const { objectUrl } of cachedAssets) {
      URL.revokeObjectURL(objectUrl)
    }

    throw error
  }
}
