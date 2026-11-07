/**
  File: ActivityPage.tsx | Author: Chace Nielson
  Date Created: Nov 6, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Guide learners to the Frank Slide map before unlocking a four-question quiz.

  Usage:
  - Lazy-loaded as the Frank Slide module's activity page.

  Notes:
  - The Frank Slide POI checkpoint is required before the quiz is available.
 */
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useJournal } from '@/journal/context/useJournal'
import { getModuleExplorePath, getModuleOverviewPath } from '@/modules/routes'
import { buildQuizQuestions } from '@/module-tools/quiz-system/buildQuizQuestions'
import { Quiz } from '@/module-tools/quiz-system/Quiz'
import type { ModuleActivityProps } from '@/modules/types'
import { frankSlideQuizQuestions } from '../data/quiz'
import {
  frankSlidePoiSelectedCheckpoint,
  frankSlideQuizCompletedCheckpoint,
} from '../journal/checkpoints'

type QuizCompleteProps = {
  moduleId: string
  restart: () => void
  completeCheckpoint: ModuleActivityProps['completeCheckpoint']
}

function QuizComplete({
  moduleId,
  restart,
  completeCheckpoint,
}: QuizCompleteProps) {
  const { t } = useTranslation('frankSlide')
  const { openJournal } = useJournal()

  useEffect(() => {
    completeCheckpoint(frankSlideQuizCompletedCheckpoint)
  }, [completeCheckpoint])

  return (
    <div className="panel space-y-4">
      <h3>{t('activity.complete.title')}</h3>
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

export default function FrankSlide({
  moduleId,
  completedCheckpoints,
  completeCheckpoint,
}: ModuleActivityProps) {
  const { t } = useTranslation('frankSlide')
  const { t: tGlobal } = useTranslation('global')
  const questions = buildQuizQuestions(
    frankSlideQuizQuestions,
    t('activity.questions', { returnObjects: true }),
  )
  const hasFoundFrankSlide = completedCheckpoints.includes(
    frankSlidePoiSelectedCheckpoint,
  )

  return (
    <section aria-labelledby="activity-title" className="max-w-3xl space-y-6">
      <p className="font-semibold text-pine">{t('category')}</p>
      <h1 id="activity-title">{t('title')}</h1>
      <p className="text-lg text-muted">{t('activity.introduction')}</p>
      <section aria-labelledby="map-first-title" className="panel space-y-3">
        <h2 id="map-first-title">{t('activity.mapFirst.heading')}</h2>
        <p className="text-muted">{t('activity.mapFirst.description')}</p>
        <Link to={getModuleExplorePath(moduleId)} className="button-secondary">
          {tGlobal('explore.openActivity')}
        </Link>
      </section>
      <section aria-labelledby="quiz-title" className="space-y-4">
        <h2 id="quiz-title">{t('activity.quiz.heading')}</h2>
        {hasFoundFrankSlide ? (
          <Quiz
            questions={questions}
            completedQuestionIds={completedCheckpoints}
            onQuestionCorrect={(question) => completeCheckpoint(question.id)}
            renderComplete={({ restart }) => (
              <QuizComplete
                moduleId={moduleId}
                restart={restart}
                completeCheckpoint={completeCheckpoint}
              />
            )}
          />
        ) : (
          <div role="status" className="panel space-y-2">
            <h3>{t('activity.quiz.lockedTitle')}</h3>
            <p className="text-muted">{t('activity.quiz.lockedDescription')}</p>
          </div>
        )}
      </section>
      <Link to={getModuleOverviewPath(moduleId)} className="button-secondary">
        {t('backToOverview')}
      </Link>
    </section>
  )
}
