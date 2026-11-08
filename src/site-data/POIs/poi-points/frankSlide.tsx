/**
  File: frankSlide.tsx | Author: Chace Nielson
  Date Created: Nov 7, 2026
  Date Updated: Nov 8, 2026

  Description:
  - Define the shared Frank Slide POI and its archival-photo information content.

  Usage:
  - Included in the base POI list and reused by the Frank Slide module.

  Notes:
  - Checkpoint identifiers are supplied only by module POI definitions.
 */
import { useTranslation } from 'react-i18next'
import { useMediaViewer } from '@/module-tools/media-viewer/hooks/useMediaViewer'
import type { MapPoiDefinition, MapPoiInfoContentProps } from '@/modules/types'
import frankSlideMountainArchive from '@/mapping/assets/frank-slide/frank-slide-mountain-archive.png'
import frankSlideStreetArchive from '@/mapping/assets/frank-slide/frank-slide-street-archive.png'

export const frankSlidePoi = {
  id: 'frankSlide',
  titleKey: 'view.defaultPois.frankSlide',
  coordinates: [-114.3943, 49.6],
  view: {
    center: [-114.3943, 49.6],
    zoom: 12,
    pitch: 65,
    bearing: -90,
  },
  infoContent: FrankSlideInfoContent,
} as const satisfies MapPoiDefinition

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

function FrankSlideInfoContent({ onInteraction }: MapPoiInfoContentProps) {
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
