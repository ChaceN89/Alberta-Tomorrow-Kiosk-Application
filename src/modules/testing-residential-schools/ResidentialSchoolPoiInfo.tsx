/**
  File: ResidentialSchoolPoiInfo.tsx | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Show school details and its audio, video, or image-viewer activity.

  Usage:
  - Rendered inside a residential-school map information panel.

  Notes:
  - Media milestones are recorded through the module checkpoint callback.
 */
import { useTranslation } from 'react-i18next'
import { TrackPlayButton } from '@/module-tools/media-player/components/TrackPlayButton'
import { useMediaViewer } from '@/module-tools/media-viewer/hooks/useMediaViewer'
import type { ModuleMapPoi } from '@/modules/types'
import {
  bloodSchoolAudioCheckpoint,
  bloodSchoolPhotoCheckpoint,
  lesserSlaveLakeAudioCheckpoint,
  stAlbertMessageCheckpoint,
  stAlbertVideoCheckpoint,
} from './checkpoints'
import { stAlbertSampleMessage } from './messages'
import { bloodSchoolAudioTrack, lesserSlaveLakeAudioTrack } from './tracks'
import { stAlbertYouTubeTrack } from './videos'
import bloodSchoolChildrenPhoto from './assets/blood-school-children.png'

type ResidentialSchoolDetails = {
  id: ModuleMapPoi['id']
  name: string
  location: string
  operatingYears: string
  description: string
  imageAlt: string
  source: string
}

type ResidentialSchoolPoiInfoProps = {
  school: ResidentialSchoolDetails
  schoolImage: string
  onComplete: (checkpointId: string) => void
}

export function ResidentialSchoolPoiInfo({
  school,
  schoolImage,
  onComplete,
}: ResidentialSchoolPoiInfoProps) {
  const { t } = useTranslation('residentialSchool')
  const { openImage, openMessage } = useMediaViewer()

  return (
    <div className="space-y-4">
      <img
        src={schoolImage}
        alt={school.imageAlt}
        className="mapping-poi-info-image"
      />
      <p>
        <span className="font-semibold">{t('activity.location')}</span>{' '}
        {school.location}
      </p>
      <p>
        <span className="font-semibold">{t('activity.operatingYears')}</span>{' '}
        {school.operatingYears}
      </p>
      <p className="text-muted">{school.description}</p>

      {school.id === 'st-marys-blood' && (
        <section className="space-y-3" aria-labelledby="school-media-heading">
          <h3 id="school-media-heading" className="font-semibold">
            {t('activity.media.heading')}
          </h3>
          <TrackPlayButton
            track={bloodSchoolAudioTrack}
            onEnd={() => onComplete(bloodSchoolAudioCheckpoint)}
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
                  onOpen: () => onComplete(bloodSchoolPhotoCheckpoint),
                  origin: event.currentTarget,
                },
              )
            }
          >
            {t('activity.media.bloodPhoto.open')}
          </button>
        </section>
      )}

      {school.id === 'st-albert-youville' && (
        <section className="space-y-3" aria-labelledby="school-media-heading">
          <h3 id="school-media-heading" className="font-semibold">
            {t('activity.media.heading')}
          </h3>
          <TrackPlayButton
            track={stAlbertYouTubeTrack}
            onEnd={() => onComplete(stAlbertVideoCheckpoint)}
          />
          <button
            type="button"
            className="button-secondary"
            onClick={(event) =>
              openMessage(
                {
                  title: t(stAlbertSampleMessage.title),
                  subtitle: t(stAlbertSampleMessage.subtitle),
                  message: t(stAlbertSampleMessage.message),
                  images: stAlbertSampleMessage.images.map((image) => ({
                    src: image.src,
                    alt: t(image.alt),
                  })),
                },
                {
                  onOpen: () => onComplete(stAlbertMessageCheckpoint),
                  origin: event.currentTarget,
                },
              )
            }
          >
            {t('activity.media.stAlbertMessage.open')}
          </button>
        </section>
      )}

      {school.id === 'lesser-slave-lake' && (
        <section className="space-y-3" aria-labelledby="school-media-heading">
          <h3 id="school-media-heading" className="font-semibold">
            {t('activity.media.heading')}
          </h3>
          <TrackPlayButton
            track={lesserSlaveLakeAudioTrack}
            onEnd={() => onComplete(lesserSlaveLakeAudioCheckpoint)}
          />
        </section>
      )}

      <a
        href={school.source}
        target="_blank"
        rel="noreferrer"
        className="inline-block font-semibold text-pine underline underline-offset-4"
      >
        {t('activity.sourceLabel')}
      </a>
    </div>
  )
}
