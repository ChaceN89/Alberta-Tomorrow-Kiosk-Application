/**
  File: defaultPoiVideos.ts | Author: Chace Nielson
  Date Created: Nov 6, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Define direct video tracks for the Banff and Calgary default points of interest.

  Usage:
  - Used by AlbertaMap and the developer page's media player examples.

  Notes:
  - Video URLs and poster images are imported from mapping assets.
 */
import type { VideoTrack } from '@/module-tools/media-player/provider/types'
import type { DefaultPoiId } from './map-settings/defaultPOISettings'
import banffVideoSrc from './assets/banff-bow-falls.mp4?url'
import banffPoster from './assets/banff-bow-falls-poster.jpg'
import calgaryVideoSrc from './assets/calgary-downtown.mp4?url'
import calgaryPoster from './assets/calgary-peace-bridge-poster.jpg'

export const banffDirectVideoTrack = {
  type: 'video',
  id: 'default-poi-banff-video',
  src: banffVideoSrc,
  coverArt: banffPoster,
  title: 'Bow Falls',
  subtitle: 'Banff, Alberta',
  translation: {
    namespace: 'mapping',
    titleKey: 'view.defaultPoiVideos.banff.title',
    subtitleKey: 'view.defaultPoiVideos.banff.subtitle',
  },
} satisfies VideoTrack

export const calgaryDirectVideoTrack = {
  type: 'video',
  id: 'default-poi-calgary-video',
  src: calgaryVideoSrc,
  coverArt: calgaryPoster,
  title: 'Downtown Calgary',
  subtitle: 'Calgary, Alberta',
  translation: {
    namespace: 'mapping',
    titleKey: 'view.defaultPoiVideos.calgary.title',
    subtitleKey: 'view.defaultPoiVideos.calgary.subtitle',
  },
} satisfies VideoTrack

export const DEFAULT_POI_VIDEO_TRACKS: Partial<
  Record<DefaultPoiId, VideoTrack>
> = {
  banff: banffDirectVideoTrack,
  calgary: calgaryDirectVideoTrack,
}
