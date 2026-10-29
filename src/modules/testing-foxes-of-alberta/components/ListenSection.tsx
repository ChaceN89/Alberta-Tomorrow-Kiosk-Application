/**
  File: ListenSection.tsx | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Show the wildlife expedition's listening clips with play buttons and checkpoint status.
  - Track start and finish callbacks record the clip's configured journal checkpoints.

  Usage:
  - Rendered in the activity view of entry-FoxesOfAlberta.

  Notes:
  - Checkpoints are recorded by callbacks the player keeps, even after leaving this page.
 */
import { useTranslation } from 'react-i18next'
import { TrackPlayButton } from '../../../module-tools/media-player/TrackPlayButton'
import type { ModuleCheckpointProps } from '../../types'
import { foxesVideoCheckpoint } from '../checkpoints'
import { foxesOfAlbertaTracks } from '../tracks'
import { foxesOfAlbertaVideo } from '../videos'

type ListenSectionProps = ModuleCheckpointProps

export function ListenSection({
  completedCheckpoints,
  completeCheckpoint,
}: ListenSectionProps) {
  const { t } = useTranslation('wildlifeFinder')

  return (
    <section aria-labelledby="listen-title" className="space-y-4">
      <h2 id="listen-title">{t('listen.heading')}</h2>
      <p className="text-muted">{t('listen.description')}</p>
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {foxesOfAlbertaTracks.map((track) => {
          const steps = [
            ...('startCheckpoint' in track
              ? ([['started', track.startCheckpoint]] as const)
              : []),
            ...('endCheckpoint' in track
              ? ([['finished', track.endCheckpoint]] as const)
              : []),
          ]

          return (
            <li key={track.id} className="panel flex flex-col gap-4 p-5 md:p-6">
              <div className="space-y-1">
                <h3 className="text-xl font-semibold">
                  {t(`listen.tracks.${track.key}.title`)}
                </h3>
                <p className="text-muted">
                  {t(`listen.tracks.${track.key}.description`)}
                </p>
              </div>
              <ul className="space-y-1 text-sm">
                {steps.map(([step, checkpointId]) => {
                  const isDone = completedCheckpoints.includes(checkpointId)

                  return (
                    <li
                      key={step}
                      className={`flex items-center gap-2 ${
                        isDone ? 'font-semibold text-pine' : 'text-muted'
                      }`}
                    >
                      <span aria-hidden="true">{isDone ? '✓' : '○'}</span>
                      {t(`listen.steps.${step}`)}
                      <span className="sr-only">
                        {t(
                          isDone ? 'listen.status.done' : 'listen.status.todo',
                        )}
                      </span>
                    </li>
                  )
                })}
              </ul>
              <div>
                <TrackPlayButton
                  track={{
                    type: 'audio',
                    id: track.id,
                    src: track.src,
                    coverArt: track.coverArt,
                    title: t(`listen.tracks.${track.key}.title`),
                    subtitle: t('title'),
                    translation: {
                      namespace: 'wildlifeFinder',
                      titleKey: `listen.tracks.${track.key}.title`,
                      subtitleKey: 'title',
                    },
                  }}
                  onStart={
                    'startCheckpoint' in track
                      ? () => completeCheckpoint(track.startCheckpoint)
                      : undefined
                  }
                  onEnd={
                    'endCheckpoint' in track
                      ? () => completeCheckpoint(track.endCheckpoint)
                      : undefined
                  }
                />
              </div>
            </li>
          )
        })}
      </ul>
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">{t('listen.videoHeading')}</h3>
        <article className="panel flex flex-col gap-4 p-5 md:p-6">
          <img
            src={foxesOfAlbertaVideo.coverArt}
            alt=""
            className="aspect-video w-full rounded-lg object-cover"
          />
          <div className="space-y-1">
            <h4 className="text-xl font-semibold">{t('listen.videoTitle')}</h4>
            <p className="text-muted">{t('listen.videoDescription')}</p>
          </div>
          <ul className="space-y-1 text-sm">
            <li
              className={`flex items-center gap-2 ${
                completedCheckpoints.includes(foxesVideoCheckpoint)
                  ? 'font-semibold text-pine'
                  : 'text-muted'
              }`}
            >
              <span aria-hidden="true">
                {completedCheckpoints.includes(foxesVideoCheckpoint)
                  ? '✓'
                  : '○'}
              </span>
              {t('listen.videoFinished')}
              <span className="sr-only">
                {t(
                  completedCheckpoints.includes(foxesVideoCheckpoint)
                    ? 'listen.status.done'
                    : 'listen.status.todo',
                )}
              </span>
            </li>
          </ul>
          <TrackPlayButton
            track={{
              ...foxesOfAlbertaVideo,
              title: t('listen.videoTitle'),
              subtitle: t('title'),
              translation: {
                namespace: 'wildlifeFinder',
                titleKey: 'listen.videoTitle',
                subtitleKey: 'title',
              },
            }}
            onEnd={() => completeCheckpoint(foxesVideoCheckpoint)}
          />
        </article>
      </div>
    </section>
  )
}
