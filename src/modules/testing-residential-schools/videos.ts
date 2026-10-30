/**
  File: videos.ts | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Define the YouTube video shown from the St. Albert map information panel.

  Usage:
  - The map info panel and journal replay action use this shared track.

  Notes:
  - The thumbnail uses YouTube's standard hqdefault image endpoint.
 */
import type { YouTubeTrack } from '@/module-tools/media-player/provider/types'

export const stAlbertYouTubeThumbnail =
  'https://img.youtube.com/vi/CEmbcJ_2oPA/hqdefault.jpg'

export const stAlbertYouTubeTrack = {
  type: 'youtube',
  id: 'residential-schools-st-albert-video',
  videoId: 'CEmbcJ_2oPA',
  title: 'Residential school video',
  subtitle: 'Residential schools in Alberta',
  coverArt: stAlbertYouTubeThumbnail,
  translation: {
    namespace: 'residentialSchool',
    titleKey: 'activity.media.stAlbertVideo.title',
    subtitleKey: 'title',
  },
} satisfies YouTubeTrack
