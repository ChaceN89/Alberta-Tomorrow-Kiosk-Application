/**
  File: LesserSlaveLakeResidentialSchoolPoi.tsx | Author: Chace Nielson
  Date Created: Nov 6, 2026
  Date Updated: Nov 7, 2026

  Description:
  - Render Lesser Slave Lake school details and its audio track.

  Usage:
  - Opened by selecting the Lesser Slave Lake point on the residential-schools map.

  Notes:
  - Audio completion is emitted as a POI interaction for module-owned mapping.
 */
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { TrackPlayButton } from '@/module-tools/media-player/components/TrackPlayButton'
import type { MapPoiInfoContentProps } from '@/modules/types'
import { lesserSlaveLakeAudioTrack } from '../../data/audio'
import lesserSlaveLakeLandscape from '../../assets/lesser-slave-lake.jpg'
import { ResidentialSchoolPoiDetails } from './ResidentialSchoolPoiDetails'
import { useResidentialSchool } from './useResidentialSchool'

export function LesserSlaveLakeResidentialSchoolPoi({
  onInteraction,
}: MapPoiInfoContentProps) {
  const { t } = useTranslation('residentialSchool')
  const school = useResidentialSchool('lesser-slave-lake')
  const headingId = useId()

  return (
    <ResidentialSchoolPoiDetails
      school={school}
      image={lesserSlaveLakeLandscape}
    >
      <section className="space-y-3" aria-labelledby={headingId}>
        <h3 id={headingId} className="font-semibold">
          {t('activity.media.heading')}
        </h3>
        <TrackPlayButton
          track={lesserSlaveLakeAudioTrack}
          onEnd={() => onInteraction?.('audioFinished')}
        />
      </section>
    </ResidentialSchoolPoiDetails>
  )
}
