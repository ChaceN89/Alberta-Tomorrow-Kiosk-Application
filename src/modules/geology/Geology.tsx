/**
 * File: Geology.tsx | Author: Chace Nielson
 * Created: 2026-10-23 | Updated: 2026-10-23
 * Description: Three-question geology quiz that records journal checkpoints.
 * Dependencies: React state, React Router, react-i18next, journal context, quiz data.
 */
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useJournal } from '../../journal/useJournal'
import type { ModuleActivityProps } from '../types'
import { geologyCheckpoints, geologyCorrectOptions } from './quiz'

export default function Geology({
  completedCheckpoints,
  completeCheckpoint,
}: ModuleActivityProps) {
  const { t } = useTranslation('geology')
  const { openJournal } = useJournal()
  const questions = t('activity.questions', { returnObjects: true })
  const total = geologyCheckpoints.length
  const [questionIndex, setQuestionIndex] = useState(() => {
    const firstIncomplete = geologyCheckpoints.findIndex(
      (checkpointId) => !completedCheckpoints.includes(checkpointId),
    )

    return firstIncomplete === -1 ? total : firstIncomplete
  })
  const [selected, setSelected] = useState<number | null>(null)

  const question = questions[questionIndex]
  const checkpointId = geologyCheckpoints[questionIndex]
  const correctOption = geologyCorrectOptions[questionIndex]
  const isCorrect = selected !== null && selected === correctOption
  const isLastQuestion = questionIndex === total - 1

  const chooseOption = (optionIndex: number) => {
    setSelected(optionIndex)

    if (optionIndex === correctOption && checkpointId) {
      completeCheckpoint(checkpointId)
    }
  }

  const goToNext = () => {
    setSelected(null)
    setQuestionIndex((index) => index + 1)
  }

  const restart = () => {
    setSelected(null)
    setQuestionIndex(0)
  }

  return (
    <section aria-labelledby="activity-title" className="max-w-3xl space-y-6">
      <p className="font-semibold text-pine">{t('category')}</p>
      <h1 id="activity-title">{t('title')}</h1>
      <p className="text-lg text-muted">{t('activity.introduction')}</p>
      {question && checkpointId ? (
        <div className="panel space-y-6">
          <p className="text-sm font-semibold text-pine">
            {t('activity.progress', { current: questionIndex + 1, total })}
          </p>
          <fieldset>
            <legend className="mb-4 text-xl font-semibold">
              {question.prompt}
            </legend>
            <div className="grid gap-3">
              {question.options.map((option, optionIndex) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={selected === optionIndex}
                  disabled={isCorrect}
                  className="button-secondary"
                  onClick={() => chooseOption(optionIndex)}
                >
                  {option}
                </button>
              ))}
            </div>
          </fieldset>
          <p role="status" className="min-h-16 font-medium text-pine">
            {selected !== null &&
              (isCorrect ? question.correct : question.tryAgain)}
          </p>
          {isCorrect && (
            <button type="button" className="button" onClick={goToNext}>
              {t(isLastQuestion ? 'activity.finish' : 'activity.next')}
            </button>
          )}
        </div>
      ) : (
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
      <Link to="/modules/geology" className="button-secondary">
        {t('backToOverview')}
      </Link>
    </section>
  )
}
