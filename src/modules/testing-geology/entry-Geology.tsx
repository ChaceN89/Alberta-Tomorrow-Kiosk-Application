/**
  File: entry-Geology.tsx | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Geology activity with a shared 3D oil barrel viewer and a checkpointed quiz.

  Usage:
  - Registered activity components are lazy-loaded by the module registry.

  Notes:
  - Question text lives in module.geology.json; ids and correct answers live in ./quiz.ts.
 */
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useJournal } from '@/journal/useJournal'
import { getModuleOverviewPath } from '@/modules/routes'
import { buildQuizQuestions } from '@/module-tools/quiz-system/buildQuizQuestions'
import { Quiz } from '@/module-tools/quiz-system/Quiz'
import { TrackPlayButton } from '@/module-tools/media-player/components/TrackPlayButton'
import { useMediaViewer } from '@/module-tools/media-viewer/hooks/useMediaViewer'
import type { ModelViewerContent } from '@/module-tools/media-viewer/provider/types'
import type { ModuleActivityProps } from '@/modules/types'
import { geologyVideos } from './videos'
import { geologyQuizQuestions } from './quiz'
import {
  oilBarrelActivityPreviewUrl,
  oilBarrelModelAssets,
} from './oilBarrelModel'
import {
  geologyQuizCompletedCheckpoint,
  geologyOilBarrelViewedCheckpoint,
  geologyVideoStartedCheckpoint,
} from './checkpoints'

type GeologyQuizCompleteProps = {
  moduleId: string
  restart: () => void
  completeCheckpoint: ModuleActivityProps['completeCheckpoint']
}

function GeologyQuizComplete({
  moduleId,
  restart,
  completeCheckpoint,
}: GeologyQuizCompleteProps) {
  const { t } = useTranslation('geology')
  const { openJournal } = useJournal()

  useEffect(() => {
    completeCheckpoint(geologyQuizCompletedCheckpoint)
  }, [completeCheckpoint])

  return (
    <div className="panel space-y-4">
      <h2>{t('activity.complete.title')}</h2>
      <p className="text-muted">{t('activity.complete.description')}</p>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="button"
          onClick={() => openJournal(moduleId)}
        >
          {t('activity.complete.viewJournal')}
        </button>
        <button type="button" className="button-secondary" onClick={restart}>
          {t('activity.complete.retry')}
        </button>
      </div>
    </div>
  )
}

export default function Geology({
  moduleId,
  completedCheckpoints,
  completeCheckpoint,
}: ModuleActivityProps) {
  const { t } = useTranslation('geology')
  const { openModel } = useMediaViewer()
  const oilBarrelModel: ModelViewerContent = {
    ...oilBarrelModelAssets,
    title: t('activity.media.oilBarrelTitle'),
    description: t('activity.media.oilBarrelDescription'),
  }

  // Each question id doubles as its journal checkpoint id.
  const questions = buildQuizQuestions(
    geologyQuizQuestions,
    t('activity.questions', { returnObjects: true }),
  )

  return (
    <section aria-labelledby="activity-title" className="max-w-3xl space-y-6">
      <p className="font-semibold text-pine">{t('category')}</p>
      <h1 id="activity-title">{t('title')}</h1>
      <p className="text-lg text-muted">{t('activity.introduction')}</p>
      <section aria-labelledby="geology-media-title" className="space-y-4">
        <div>
          <h2 id="geology-media-title">{t('activity.media.heading')}</h2>
          <p className="text-muted">{t('activity.media.description')}</p>
        </div>
        <ul className="grid gap-4 md:grid-cols-2">
          {geologyVideos.map((video) => (
            <li key={video.id} className="panel flex flex-col gap-4 p-5 md:p-6">
              <img
                src={video.coverArt}
                alt=""
                className="aspect-video w-full rounded-lg object-cover"
              />
              <div className="space-y-1">
                <h3 className="text-xl font-semibold">
                  {t('activity.media.videoTitle')}
                </h3>
                <p className="text-muted">
                  {t('activity.media.videoDescription')}
                </p>
              </div>
              <TrackPlayButton
                track={{
                  ...video,
                  title: t('activity.media.videoTitle'),
                  subtitle: t('title'),
                  translation: {
                    namespace: 'geology',
                    titleKey: 'activity.media.videoTitle',
                    subtitleKey: 'title',
                  },
                }}
                onStart={() =>
                  completeCheckpoint(geologyVideoStartedCheckpoint)
                }
              />
            </li>
          ))}
          <li className="panel flex flex-col gap-4 p-5 md:p-6">
            <button
              type="button"
              className="block w-full rounded-lg focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-focus"
              aria-label={t('activity.media.openOilBarrel')}
              onClick={(event) =>
                openModel(oilBarrelModel, {
                  origin: event.currentTarget,
                  onOpen: () =>
                    completeCheckpoint(geologyOilBarrelViewedCheckpoint),
                })
              }
            >
              <img
                src={oilBarrelActivityPreviewUrl}
                alt=""
                className="aspect-video w-full rounded-lg object-contain"
              />
            </button>
            <div className="space-y-1">
              <h3 className="text-xl font-semibold">
                {t('activity.media.oilBarrelTitle')}
              </h3>
              <p className="text-muted">
                {t('activity.media.oilBarrelDescription')}
              </p>
            </div>
          </li>
        </ul>
      </section>
      <Quiz
        questions={questions}
        completedQuestionIds={completedCheckpoints}
        onQuestionCorrect={(question) => completeCheckpoint(question.id)}
        renderComplete={({ restart }) => (
          <GeologyQuizComplete
            moduleId={moduleId}
            restart={restart}
            completeCheckpoint={completeCheckpoint}
          />
        )}
      />
      <Link to={getModuleOverviewPath(moduleId)} className="button-secondary">
        {t('backToOverview')}
      </Link>
    </section>
  )
}
