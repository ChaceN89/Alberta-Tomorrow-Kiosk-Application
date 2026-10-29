/**
  File: useTrackText.ts | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Resolve a media track's title and subtitle in the current language.

  Usage:
  - Used by the player panel and its queue views.

  Notes:
  - Tracks with a translation read their module namespace; others use their own text.
 */
import { useTranslation } from 'react-i18next'
import type { MediaTrack } from '../provider/types'

export function useTrackText() {
  const { i18n } = useTranslation('moduleTools')

  const getTrackTitle = (track: MediaTrack) =>
    track.translation
      ? i18n.t(track.translation.titleKey, {
          ns: track.translation.namespace,
          defaultValue: track.title,
        })
      : track.title

  const getTrackSubtitle = (track: MediaTrack) =>
    track.translation?.subtitleKey
      ? i18n.t(track.translation.subtitleKey, {
          ns: track.translation.namespace,
          defaultValue: track.subtitle ?? '',
        })
      : track.subtitle

  return { getTrackTitle, getTrackSubtitle }
}
