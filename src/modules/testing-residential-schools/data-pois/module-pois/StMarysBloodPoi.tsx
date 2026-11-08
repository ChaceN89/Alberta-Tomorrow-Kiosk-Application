/**
  File: StMarysBloodPoi.tsx | Author: Chace Nielson
  Date Created: Nov 6, 2026
  Date Updated: Nov 7, 2026

  Description:
  - Render St. Mary's school details, audio, and the supplied image viewer.

  Usage:
  - Opened by selecting the St. Mary's point on the residential-schools map.

  Notes:
  - Media milestones are emitted as POI interactions for module-owned mapping.
 */
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { TrackPlayButton } from '@/module-tools/media-player/components/TrackPlayButton'
import { useMediaViewer } from '@/module-tools/media-viewer/hooks/useMediaViewer'
import type { MapPoiInfoContentProps } from '@/modules/types'
import { bloodSchoolAudioTrack } from '../../data/audio'
import bloodSchoolChildrenPhoto from '../../assets/blood-school-children.png'
import stMarysLandscape from '../../assets/st-marys-landscape.jpg'
import { ResidentialSchoolPoiDetails } from './ResidentialSchoolPoiDetails'
import { useResidentialSchool } from './useResidentialSchool'

export function StMarysBloodPoi({ onInteraction }: MapPoiInfoContentProps) {
  const { t } = useTranslation('residentialSchool')
  const { openImage } = useMediaViewer()
  const school = useResidentialSchool('st-marys-blood')
  const headingId = useId()

  return (
    <ResidentialSchoolPoiDetails school={school} image={stMarysLandscape}>
      <section className="space-y-3" aria-labelledby={headingId}>
        <h3 id={headingId} className="font-semibold">
          {t('activity.media.heading')}
        </h3>
        <TrackPlayButton
          track={bloodSchoolAudioTrack}
          onEnd={() => onInteraction?.('audioFinished')}
        />
        <button
          type="button"
          className="button-secondary"
          onClick={(event) =>
            openImage(
              {
                title: t('activity.media.bloodPhoto.title'),
                description: t('activity.media.bloodPhoto.description'),
                alt: t('activity.media.bloodPhoto.alt'),
                src: bloodSchoolChildrenPhoto,
              },
              {
                onOpen: () => onInteraction?.('photoViewed'),
                origin: event.currentTarget,
              },
            )
          }
        >
          {t('activity.media.bloodPhoto.open')}
        </button>
      </section>
    </ResidentialSchoolPoiDetails>
  )
}
