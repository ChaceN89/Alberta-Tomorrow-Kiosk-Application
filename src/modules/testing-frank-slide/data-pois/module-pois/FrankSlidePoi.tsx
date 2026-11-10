/**
  File: FrankSlidePoi.tsx | Author: Chace Nielson
  Date Created: Nov 7, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Present the expedition-only Frank Slide archival-photo content.

  Usage:
  - Rendered by the Frank Slide expedition's POI definition.

  Notes:
  - Checkpoint identifiers are supplied only by module POI definitions.
  - The map point marks slide debris north of Highway 3, not the interpretive centre.
 */
import { useTranslation } from 'react-i18next'
import { useMediaViewer } from '@/module-tools/media-viewer/hooks/useMediaViewer'
import type { MapPoiInfoContentProps } from '@/modules/types'
import frankSlideMountainArchive from '@/mapping/assets/frank-slide/frank-slide-mountain-archive.png'
import frankSlideStreetArchive from '@/mapping/assets/frank-slide/frank-slide-street-archive.png'

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

export function FrankSlideInfoContent({
  onInteraction,
}: MapPoiInfoContentProps) {
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
                      onOpen: () => onInteraction?.(id),
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
