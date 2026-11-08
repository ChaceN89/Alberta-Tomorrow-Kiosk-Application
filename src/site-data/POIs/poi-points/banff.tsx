/**
  File: banff.tsx | Author: Chace Nielson
  Date Created: Nov 7, 2026
  Date Updated: Nov 7, 2026

  Description:
  - Define the Banff base-map POI and its image and video information content.

  Usage:
  - Included in the base POI list.

  Notes:
  - Coordinates use longitude, latitude order.
 */
import banffLandscape from '@/mapping/assets/banff-landscape.jpg'
import banffVideoSrc from '@/mapping/assets/banff-bow-falls.mp4?url'
import banffVideoPoster from '@/mapping/assets/banff-bow-falls-poster.jpg'
import type { VideoTrack } from '@/module-tools/media-player/provider/types'
import { BasePoiInfoContent } from '../poi-components/BasePoiInfoContent'
import type { MapPoiDefinition } from '@/modules/types'

//The POI Content
export const banffPoi = {
  id: 'banff',
  titleKey: 'view.defaultPois.banff',
  coordinates: [-115.5708, 51.1784],
  view: {
    center: [-115.5708, 51.1784],
    zoom: 12,
    pitch: 65,
    bearing: -20,
  },
  infoContent: BanffInfoContent,
} as const satisfies MapPoiDefinition

// Specific Video tracj for this POI
export const banffDirectVideoTrack = {
  type: 'video',
  id: 'default-poi-banff-video',
  src: banffVideoSrc,
  coverArt: banffVideoPoster,
  title: 'Bow Falls',
  subtitle: 'Banff, Alberta',
  translation: {
    namespace: 'mapping',
    titleKey: 'view.defaultPoiVideos.banff.title',
    subtitleKey: 'view.defaultPoiVideos.banff.subtitle',
  },
} satisfies VideoTrack

// the content component for the Banff POI - displays i nthe map info popup
// can be specialized for thei sPOI instead of using the generic BasePoiInfoContent component
function BanffInfoContent() {
  return (
    <BasePoiInfoContent
      descriptionKey="view.defaultPoiInfo.banff.description"
      image={{
        src: banffLandscape,
        altKey: 'view.defaultPoiInfo.banff.imageAlt',
      }}
      videoTrack={banffDirectVideoTrack}
    />
  )
}
