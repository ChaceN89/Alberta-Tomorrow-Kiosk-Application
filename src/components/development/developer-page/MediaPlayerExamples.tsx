/**
  File: MediaPlayerExamples.tsx | Author: Chace Nielson
  Date Created: Nov 6, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Exercise queued audio, YouTube, and direct-video tracks from the developer page.

  Usage:
  - Rendered by DeveloperPage inside the app's AudioPlayerProvider.

  Notes:
  - Reuses sample media already included by the residential schools and geology modules.
 */
import { useTranslation } from 'react-i18next'
import { TrackPlayButton } from '@/module-tools/media-player/components/TrackPlayButton'
import { geologyVideos } from '@/modules/testing-geology/data/videos'
import { bloodSchoolAudioTrack } from '@/modules/testing-residential-schools/data/audio'
import { DEFAULT_POI_VIDEO_TRACKS } from '@/mapping/defaultPoiVideos'

export function MediaPlayerExamples() {
  const { t } = useTranslation('development')
  const banffVideo = DEFAULT_POI_VIDEO_TRACKS.banff
  const calgaryVideo = DEFAULT_POI_VIDEO_TRACKS.calgary

  return (
    <section
      aria-labelledby="developer-media-player-title"
      className="space-y-4"
    >
      <div className="space-y-2">
        <h2 id="developer-media-player-title">{t('mediaPlayerExamples')}</h2>
        <p className="text-muted">{t('mediaPlayerExamplesDescription')}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <article className="panel space-y-3 p-5 md:p-6">
          <h3 className="font-semibold">{t('playAudioSample')}</h3>
          <TrackPlayButton track={bloodSchoolAudioTrack} />
        </article>
        {geologyVideos.map((video) => (
          <article key={video.id} className="panel space-y-3 p-5 md:p-6">
            <h3 className="font-semibold">{t('playYoutubeSample')}</h3>
            <TrackPlayButton track={video} />
          </article>
        ))}
        {banffVideo && (
          <article className="panel space-y-3 p-5 md:p-6">
            <h3 className="font-semibold">{t('verticalVideoSample')}</h3>
            <TrackPlayButton track={banffVideo} />
          </article>
        )}
        {calgaryVideo && (
          <article className="panel space-y-3 p-5 md:p-6">
            <h3 className="font-semibold">{t('horizontalVideoSample')}</h3>
            <TrackPlayButton track={calgaryVideo} />
          </article>
        )}
      </div>
    </section>
  )
}
