/**
  File: StMarysBloodPoi.tsx | Author: Chace Nielson
  Date Created: Nov 6, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Render St. Mary's school details, audio, and the supplied image viewer.

  Usage:
  - Opened by selecting the St. Mary's point on the residential-schools map.

  Notes:
  - Media milestones are recorded through the module checkpoint callback.
 */
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { TrackPlayButton } from '@/module-tools/media-player/components/TrackPlayButton'
import { useMediaViewer } from '@/module-tools/media-viewer/hooks/useMediaViewer'
import type { ModuleMapPoiContentProps } from '@/modules/types'
import {
  stMarysBloodSchoolAudioFinishedCheckpoint,
  stMarysBloodSchoolPhotoViewedCheckpoint,
} from '../../journal/checkpoints'
import { bloodSchoolAudioTrack } from '../../data/audio'
import bloodSchoolChildrenPhoto from '../../assets/blood-school-children.png'
import stMarysLandscape from '../../assets/st-marys-landscape.jpg'
import { ResidentialSchoolPoiDetails } from './ResidentialSchoolPoiDetails'
import { useResidentialSchool } from './useResidentialSchool'

export function StMarysBloodPoi({ onComplete }: ModuleMapPoiContentProps) {
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
          onEnd={() => onComplete(stMarysBloodSchoolAudioFinishedCheckpoint)}
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
                onOpen: () =>
                  onComplete(stMarysBloodSchoolPhotoViewedCheckpoint),
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
