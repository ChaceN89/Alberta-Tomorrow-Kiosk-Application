/**
  File: ListenSection.tsx | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Show the wildlife expedition's listening clips with play buttons and checkpoint status.
  - Track start and finish callbacks record the clip's configured journal checkpoints.

  Usage:
  - Rendered in the activity view of FindHabitat.

  Notes:
  - Checkpoints are recorded by callbacks the player keeps, even after leaving this page.
 */
import { useTranslation } from 'react-i18next'
import { TrackPlayButton } from '../../module-tools/audio-player/TrackPlayButton'
import type { ModuleActivityProps } from '../types'
import { wildlifeTracks } from './tracks'

type ListenSectionProps = ModuleActivityProps

export function ListenSection({
  completedCheckpoints,
  completeCheckpoint,
}: ListenSectionProps) {
  const { t } = useTranslation('wildlifeFinder')

  return (
    <section aria-labelledby="listen-title" className="space-y-4">
      <h2 id="listen-title">{t('listen.heading')}</h2>
      <p className="text-muted">{t('listen.description')}</p>
      <ul className="grid gap-4 md:grid-cols-2">
        {wildlifeTracks.map((track) => {
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
                    id: track.id,
                    src: track.src,
                    coverArt: track.coverArt,
                    title: t(`listen.tracks.${track.key}.title`),
                    subtitle: t('title'),
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
    </section>
  )
}
