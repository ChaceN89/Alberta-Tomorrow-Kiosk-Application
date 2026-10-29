/**
  File: videos.ts | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Oct 28, 2026

  Description:
  - YouTube media items shown in the geology activity.

  Usage:
  - Rendered through the shared media queue and player.

  Notes:
  - YouTube thumbnails use the public hqdefault image endpoint.
 */
import type { YouTubeTrack } from '../../module-tools/media-player/useAudioPlayer'

export const geologyVideos: YouTubeTrack[] = [
  {
    type: 'youtube',
    id: 'geology-natural-landscapes',
    videoId: '9o7hMbkFhvY',
    title: 'Natural Landscapes. Alberta Tomorrow.',
    subtitle: 'Alberta Tomorrow',
    coverArt: 'https://img.youtube.com/vi/9o7hMbkFhvY/hqdefault.jpg',
  },
]
