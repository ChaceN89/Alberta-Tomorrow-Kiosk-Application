/**
  File: Geology.tsx | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Three-question geology quiz built on the shared quiz system that records journal checkpoints.

  Usage:
  - Registered activity components are lazy-loaded by the module registry.

  Notes:
  - Question text lives in module.geology.json; ids and correct answers live in ./quiz.ts.
 */
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useJournal } from '../../journal/useJournal'
import { Quiz } from '../../module-tools/quiz-system/Quiz'
import type { QuizQuestion } from '../../module-tools/quiz-system/types'
import { TrackPlayButton } from '../../module-tools/media-player/TrackPlayButton'
import type { ModuleActivityProps } from '../types'
import { geologyVideos } from './media'
import { geologyCheckpoints, geologyCorrectOptions } from './quiz'

export default function Geology({
  completedCheckpoints,
  completeCheckpoint,
}: ModuleActivityProps) {
  const { t } = useTranslation('geology')
  const { openJournal } = useJournal()

  // Each question id doubles as its journal checkpoint id.
  const questions: QuizQuestion[] = t('activity.questions', {
    returnObjects: true,
  }).map((question, index) => ({
    id: geologyCheckpoints[index],
    prompt: question.prompt,
    options: question.options.map((option) => Object.values(option)[0]),
    correctIndex: geologyCorrectOptions[index],
    correctFeedback: question.correct,
    incorrectFeedback: question.tryAgain,
  }))

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
              />
            </li>
          ))}
        </ul>
      </section>
      <Quiz
        questions={questions}
        completedQuestionIds={completedCheckpoints}
        onQuestionCorrect={(question) => completeCheckpoint(question.id)}
        renderComplete={({ restart }) => (
          <div className="panel space-y-4">
            <h2>{t('activity.complete.title')}</h2>
            <p className="text-muted">{t('activity.complete.description')}</p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="button"
                onClick={() => openJournal('geology')}
              >
                {t('activity.complete.viewJournal')}
              </button>
              <button
                type="button"
                className="button-secondary"
                onClick={restart}
              >
                {t('activity.complete.retry')}
              </button>
            </div>
          </div>
        )}
      />
      <Link to="/modules/geology" className="button-secondary">
        {t('backToOverview')}
      </Link>
    </section>
  )
}
