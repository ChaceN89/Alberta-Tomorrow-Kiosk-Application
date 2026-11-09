/**
  File: calgary.tsx | Author: Chace Nielson
  Date Created: Nov 7, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Define the Calgary base-map POI and its video information content.

  Usage:
  - Included in the base POI list.

  Notes:
  - Coordinates use longitude, latitude order.
 */
import calgaryVideoSrc from '@/mapping/assets/calgary-downtown.mp4?url'
import calgaryVideoPoster from '@/mapping/assets/calgary-peace-bridge-poster.jpg'
import type { VideoTrack } from '@/module-tools/media-player/provider/types'
import { BasePoiInfoContent } from '../poi-components/BasePoiInfoContent'
import type { MapPoiDefinition } from '@/modules/types'

export const calgaryPoi = {
  id: 'calgary',
  titleKey: 'view.defaultPois.calgary',
  iconCategory: 'community',
  flyoverPoiFov: 90,
  coordinates: [-114.0719, 51.0447],
  view: {
    center: [-114.0719, 51.0447],
    zoom: 11,
    pitch: 50,
    bearing: 0,
  },
  infoContent: CalgaryInfoContent,
} as const satisfies MapPoiDefinition

export const calgaryDirectVideoTrack = {
  type: 'video',
  id: 'default-poi-calgary-video',
  src: calgaryVideoSrc,
  coverArt: calgaryVideoPoster,
  title: 'Downtown Calgary',
  subtitle: 'Calgary, Alberta',
  translation: {
    namespace: 'mapping',
    titleKey: 'view.defaultPoiVideos.calgary.title',
    subtitleKey: 'view.defaultPoiVideos.calgary.subtitle',
  },
} satisfies VideoTrack

function CalgaryInfoContent() {
  return (
    <BasePoiInfoContent
      descriptionKey="view.defaultPoiInfo.calgary.description"
      videoTrack={calgaryDirectVideoTrack}
    />
  )
}
