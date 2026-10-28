/**
  File: HabitatQuiz.tsx | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Wildlife expedition quiz view built on the shared quiz system.
  - Supplies translated fox questions and records their journal checkpoints when answered correctly.

  Usage:
  - Rendered by FindHabitat after the learner chooses to start the quiz.

  Notes:
  - Question content lives in module.wildlifeFinder.json under activity.
 */
import { useTranslation } from 'react-i18next'
import { Quiz } from '../../module-tools/quiz-system/Quiz'
import type { QuizQuestion } from '../../module-tools/quiz-system/types'
import { TrackPlayButton } from '../../module-tools/media-player/TrackPlayButton'
import type { ModuleActivityProps } from '../types'
import { wildlifeTracks } from './tracks'

type HabitatQuizProps = ModuleActivityProps & {
  onBackToActivity: () => void
}

export function HabitatQuiz({
  completedCheckpoints,
  completeCheckpoint,
  onBackToActivity,
}: HabitatQuizProps) {
  const { t } = useTranslation('wildlifeFinder')
  const redFoxTrack = wildlifeTracks[2]

  // Each question id doubles as its journal checkpoint id.
  const questions: QuizQuestion[] = [
    {
      id: 'swift-fox-home',
      prompt: t('quiz.questions.swiftFox.prompt'),
      options: [
        t('quiz.questions.swiftFox.options.borealWrong'),
        t('quiz.questions.swiftFox.options.shortgrassPrairieCorrect'),
        t('quiz.questions.swiftFox.options.wetlandsWrong'),
      ],
      correctIndex: 1,
      correctFeedback: t('quiz.questions.swiftFox.correct'),
      incorrectFeedback: t('quiz.questions.swiftFox.tryAgain'),
    },
    {
      id: 'red-fox-food',
      prompt: t('quiz.questions.redFox.prompt'),
      options: [
        t('quiz.questions.redFox.options.onlyLargeAnimalsWrong'),
        t('quiz.questions.redFox.options.smallAnimalsAndPlantsCorrect'),
        t('quiz.questions.redFox.options.onlyGrassWrong'),
      ],
      correctIndex: 1,
      correctFeedback: t('quiz.questions.redFox.correct'),
      incorrectFeedback: t('quiz.questions.redFox.tryAgain'),
    },
    {
      id: 'red-fox-sound-identification',
      prompt: t('quiz.questions.redFoxSound.prompt'),
      audio: (
        <TrackPlayButton
          track={{
            type: 'audio',
            id: redFoxTrack.id,
            src: redFoxTrack.src,
            coverArt: redFoxTrack.coverArt,
            title: t('listen.tracks.redFoxSound.title'),
            subtitle: t('title'),
            translation: {
              namespace: 'wildlifeFinder',
              titleKey: 'listen.tracks.redFoxSound.title',
              subtitleKey: 'title',
            },
          }}
          onStart={() => completeCheckpoint(redFoxTrack.startCheckpoint)}
        />
      ),
      options: [
        t('quiz.questions.redFoxSound.options.coyoteWrong'),
        t('quiz.questions.redFoxSound.options.redFoxCorrect'),
        t('quiz.questions.redFoxSound.options.wolfWrong'),
      ],
      correctIndex: 1,
      correctFeedback: t('quiz.questions.redFoxSound.correct'),
      incorrectFeedback: t('quiz.questions.redFoxSound.tryAgain'),
    },
  ]

  return (
    <div className="space-y-6">
      <Quiz
        questions={questions}
        completedQuestionIds={completedCheckpoints}
        onQuestionCorrect={(question) => completeCheckpoint(question.id)}
        renderComplete={({ restart }) => (
          <div className="panel space-y-4">
            <h2>{t('quiz.complete.title')}</h2>
            <p className="text-muted">{t('quiz.complete.description')}</p>
            <button
              type="button"
              className="button-secondary"
              onClick={restart}
            >
              {t('quiz.complete.retry')}
            </button>
          </div>
        )}
      />
      <button type="button" className="button" onClick={onBackToActivity}>
        {t('quiz.backToActivity')}
      </button>
    </div>
  )
}
