/**
  File: getTrackTranslationText.ts | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Resolve optional track labels from any registered i18next namespace.

  Usage:
  - Used by shared player controls and queue views for module-authored tracks.

  Notes:
  - The media player does not depend on a fixed list of learning modules.
 */
import type { MediaTrack } from '../provider/types'

type TranslationResourceLookup = {
  languages: readonly string[]
  getResource: (language: string, namespace: string, key: string) => unknown
}

export function getTrackTranslationText(
  i18n: TranslationResourceLookup,
  track: MediaTrack,
  key: 'titleKey' | 'subtitleKey',
  fallback: string,
) {
  const translationKey = track.translation?.[key]
  if (!track.translation || !translationKey) return fallback

  for (const language of i18n.languages) {
    const value = i18n.getResource(
      language,
      track.translation.namespace,
      translationKey,
    )
    if (typeof value === 'string') return value
  }

  return fallback
}
