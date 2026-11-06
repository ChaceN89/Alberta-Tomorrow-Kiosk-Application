/**
  File: StAlbertYouvillePoi.tsx | Author: Chace Nielson
  Date Created: Nov 6, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Render St. Albert school details, video, and sample message viewer.

  Usage:
  - Opened by selecting the St. Albert point on the residential-schools map.

  Notes:
  - The sample message is explicitly fictional in its localized copy.
 */
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { TrackPlayButton } from '@/module-tools/media-player/components/TrackPlayButton'
import { useMediaViewer } from '@/module-tools/media-viewer/hooks/useMediaViewer'
import type { ModuleMapPoiContentProps } from '@/modules/types'
import {
  stAlbertYouvilleMessageOpenedCheckpoint,
  stAlbertYouvilleVideoFinishedCheckpoint,
} from '../../journal/checkpoints'
import { stAlbertSampleMessage } from '../../data/messages'
import { stAlbertYouTubeTrack } from '../../data/videos'
import stAlbertRiverValley from '../../assets/st-albert-river-valley.jpg'
import { ResidentialSchoolPoiDetails } from './ResidentialSchoolPoiDetails'
import { useResidentialSchool } from './useResidentialSchool'

export function StAlbertYouvillePoi({ onComplete }: ModuleMapPoiContentProps) {
  const { t } = useTranslation('residentialSchool')
  const { openMessage } = useMediaViewer()
  const school = useResidentialSchool('st-albert-youville')
  const headingId = useId()

  return (
    <ResidentialSchoolPoiDetails school={school} image={stAlbertRiverValley}>
      <section className="space-y-3" aria-labelledby={headingId}>
        <h3 id={headingId} className="font-semibold">
          {t('activity.media.heading')}
        </h3>
        <TrackPlayButton
          track={stAlbertYouTubeTrack}
          onEnd={() => onComplete(stAlbertYouvilleVideoFinishedCheckpoint)}
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
                onOpen: () =>
                  onComplete(stAlbertYouvilleMessageOpenedCheckpoint),
                origin: event.currentTarget,
              },
            )
          }
        >
          {t('activity.media.stAlbertMessage.open')}
        </button>
      </section>
    </ResidentialSchoolPoiDetails>
  )
}
