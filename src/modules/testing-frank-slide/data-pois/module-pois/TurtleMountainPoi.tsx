/**
  File: TurtleMountainPoi.tsx | Author: Chace Nielson
  Date Created: Nov 6, 2026
  Date Updated: Nov 8, 2026

  Description:
  - Present Turtle Mountain's history, summit, trail, and monitoring context.

  Usage:
  - Rendered as the Turtle Mountain map POI info content.

  Notes:
  - Route conditions and access can change; hikers should check locally.
 */
import { useTranslation } from 'react-i18next'
import { useMediaViewer } from '@/module-tools/media-viewer/hooks/useMediaViewer'
import type { MapPoiInfoContentProps } from '@/modules/types'
import turtleMountainRockslide from '../../assets/turtle-mountain-rockslide.png'

export function TurtleMountainPoi({ onInteraction }: MapPoiInfoContentProps) {
  const { t } = useTranslation('frankSlide')
  const { openImage } = useMediaViewer()

  return (
    <div className="space-y-4">
      <p>{t('poi.turtleMountain.description')}</p>
      <section className="space-y-2">
        <h3 className="font-semibold text-pine">
          {t('poi.turtleMountain.image.heading')}
        </h3>
        <button
          type="button"
          className="block w-full rounded-lg"
          aria-label={t('poi.turtleMountain.image.open')}
          title={t('poi.turtleMountain.image.open')}
          onClick={(event) =>
            openImage(
              {
                title: t('poi.turtleMountain.image.title'),
                description: t('poi.turtleMountain.image.description'),
                alt: t('poi.turtleMountain.image.alt'),
                src: turtleMountainRockslide,
              },
              {
                onOpen: () => onInteraction?.('rockslidePhotoViewed'),
                origin: event.currentTarget,
              },
            )
          }
        >
          <img
            src={turtleMountainRockslide}
            alt={t('poi.turtleMountain.image.alt')}
            className="mapping-poi-info-image"
          />
        </button>
      </section>
      <section className="space-y-2">
        <h3 className="font-semibold text-pine">
          {t('poi.turtleMountain.trailHeading')}
        </h3>
        <p>{t('poi.turtleMountain.trailDescription')}</p>
      </section>
      <section className="space-y-2">
        <h3 className="font-semibold text-pine">
          {t('poi.turtleMountain.monitoringHeading')}
        </h3>
        <p>{t('poi.turtleMountain.monitoringDescription')}</p>
      </section>
      <p className="text-sm text-muted">{t('poi.turtleMountain.safetyNote')}</p>
    </div>
  )
}
