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
import type { ModuleActivityProps } from '../types'

type HabitatQuizProps = ModuleActivityProps & {
  onBackToActivity: () => void
}

export function HabitatQuiz({
  completedCheckpoints,
  completeCheckpoint,
  onBackToActivity,
}: HabitatQuizProps) {
  const { t } = useTranslation('wildlifeFinder')

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
