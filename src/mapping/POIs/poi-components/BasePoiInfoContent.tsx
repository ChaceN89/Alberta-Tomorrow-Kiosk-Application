/**
  File: BasePoiInfoContent.tsx | Author: Chace Nielson
  Date Created: Nov 7, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Render the standard description, optional image, and optional video for a base-map POI.
  - used for componet with simple infoamtion - customer POI won't use this component.

  Usage:
  - Composed by individual POI info-content components in the poi-points folder.

  Notes:
  - POIs with specialized content define their own component instead.
  - Images open in the media viewer without recording checkpoints.
 */
import { useTranslation } from 'react-i18next'
import type { ParseKeys } from 'i18next'
import { TrackPlayButton } from '@/module-tools/media-player/components/TrackPlayButton'
import type { VideoTrack } from '@/module-tools/media-player/provider/types'
import { PoiInfoImage } from './PoiInfoImage'

type BasePoiInfoContentProps = {
  descriptionKey?: ParseKeys<'mapping'>
  image?: {
    src: string
    altKey: ParseKeys<'mapping'>
  }
  videoTrack?: VideoTrack
}

export function BasePoiInfoContent({
  descriptionKey,
  image,
  videoTrack,
}: BasePoiInfoContentProps) {
  const { t } = useTranslation('mapping')

  return (
    <div className="space-y-4">
      {image && (
        <PoiInfoImage
          image={{
            src: image.src,
            alt: t(image.altKey),
            title: t(image.altKey),
            description: t(
              descriptionKey ?? 'view.defaultPoiInfo.genericDescription',
            ),
          }}
        />
      )}
      <p>{t(descriptionKey ?? 'view.defaultPoiInfo.genericDescription')}</p>
      {videoTrack && <TrackPlayButton track={videoTrack} />}
    </div>
  )
}
