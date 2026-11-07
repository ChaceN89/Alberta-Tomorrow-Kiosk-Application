/**
  File: FrankSlidePoiInfo.tsx | Author: Chace Nielson
  Date Created: Nov 6, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Show shared Frank Slide context and archival photographs.

  Usage:
  - Rendered by the base-map and Frank Slide module POI content registries.

  Notes:
  - Optional image callbacks let the module record photo-view checkpoints.
 */
import { useTranslation } from 'react-i18next'
import { useMediaViewer } from '@/module-tools/media-viewer/hooks/useMediaViewer'
import frankSlideMountainArchive from '../assets/frank-slide/frank-slide-mountain-archive.png'
import frankSlideStreetArchive from '../assets/frank-slide/frank-slide-street-archive.png'

const archiveImages = [
  {
    id: 'mountain',
    src: frankSlideMountainArchive,
    altKey: 'poi.images.mountainAlt',
    titleKey: 'poi.images.mountainTitle',
    descriptionKey: 'poi.images.mountainDescription',
    openKey: 'poi.images.openMountain',
  },
  {
    id: 'street',
    src: frankSlideStreetArchive,
    altKey: 'poi.images.streetAlt',
    titleKey: 'poi.images.streetTitle',
    descriptionKey: 'poi.images.streetDescription',
    openKey: 'poi.images.openStreet',
  },
] as const

export type FrankSlideArchiveImageId = (typeof archiveImages)[number]['id']

type FrankSlidePoiInfoProps = {
  onImageOpen?: (imageId: FrankSlideArchiveImageId) => void
}

export function FrankSlidePoiInfo({ onImageOpen }: FrankSlidePoiInfoProps) {
  const { t } = useTranslation('frankSlide')
  const { openImage } = useMediaViewer()

  return (
    <div className="space-y-4">
      <p>{t('poi.description')}</p>
      <ul className="grid gap-3 sm:grid-cols-2">
        {archiveImages.map(
          ({ id, src, altKey, titleKey, descriptionKey, openKey }) => (
            <li key={id}>
              <button
                type="button"
                className="block w-full rounded-lg"
                aria-label={t(openKey)}
                title={t(openKey)}
                onClick={(event) =>
                  openImage(
                    {
                      title: t(titleKey),
                      description: t(descriptionKey),
                      alt: t(altKey),
                      src,
                    },
                    {
                      onOpen: () => onImageOpen?.(id),
                      origin: event.currentTarget,
                    },
                  )
                }
              >
                <img
                  src={src}
                  alt={t(altKey)}
                  className="mapping-poi-info-image"
                />
              </button>
            </li>
          ),
        )}
      </ul>
      <p className="text-sm text-muted">{t('poi.imageSourceNote')}</p>
    </div>
  )
}
