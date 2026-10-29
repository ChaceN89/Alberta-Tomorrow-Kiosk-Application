/**
  File: videos.ts | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Oct 28, 2026

  Description:
  - YouTube videos shown in the wildlife expedition's media section.

  Usage:
  - Rendered through the shared media queue and player.

  Notes:
  - YouTube thumbnails use the public hqdefault image endpoint.
 */
import type { YouTubeTrack } from '@/module-tools/media-player/useAudioPlayer'

export const foxesOfAlbertaVideo: YouTubeTrack = {
  type: 'youtube',
  id: 'foxes-of-alberta-video',
  videoId: '1VJBWTypVNU',
  title: 'Foxes of Alberta',
  subtitle: 'Alberta Tomorrow',
  coverArt: 'https://img.youtube.com/vi/1VJBWTypVNU/hqdefault.jpg',
}
