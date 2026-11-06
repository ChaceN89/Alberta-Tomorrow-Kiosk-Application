/**
  File: LesserSlaveLakePoi.tsx | Author: Chace Nielson
  Date Created: Nov 6, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Render Lesser Slave Lake school details and its audio track.

  Usage:
  - Opened by selecting the Lesser Slave Lake point on the residential-schools map.

  Notes:
  - Audio completion is recorded through the module checkpoint callback.
 */
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { TrackPlayButton } from '@/module-tools/media-player/components/TrackPlayButton'
import type { ModuleMapPoiContentProps } from '@/modules/types'
import { lesserSlaveLakeAudioFinishedCheckpoint } from '../../journal/checkpoints'
import { lesserSlaveLakeAudioTrack } from '../../data/audio'
import lesserSlaveLakeLandscape from '../../assets/lesser-slave-lake.jpg'
import { ResidentialSchoolPoiDetails } from './ResidentialSchoolPoiDetails'
import { useResidentialSchool } from './useResidentialSchool'

export function LesserSlaveLakePoi({ onComplete }: ModuleMapPoiContentProps) {
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
          onEnd={() => onComplete(lesserSlaveLakeAudioFinishedCheckpoint)}
        />
      </section>
    </ResidentialSchoolPoiDetails>
  )
}
