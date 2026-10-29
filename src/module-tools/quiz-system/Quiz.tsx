/**
  File: Quiz.tsx | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Reusable multiple-choice quiz: one question at a time with instant feedback and retries.
  - Modules supply questions, record checkpoints on correct answers, and render their own finish screen.

  Usage:
  - <Quiz questions completedQuestionIds onQuestionCorrect renderComplete />

  Notes:
  - Wrong answers can be retried; a correct answer locks the options and offers Next or Finish.
  - Starts at the first question not listed in completedQuestionIds, or at the finish screen if all are.
 */
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { QuizQuestion } from './types'

type QuizProps = {
  questions: readonly QuizQuestion[]
  completedQuestionIds?: readonly string[]
  onQuestionCorrect?: (question: QuizQuestion) => void
  renderComplete: (controls: { restart: () => void }) => ReactNode
}

export function Quiz({
  questions,
  completedQuestionIds = [],
  onQuestionCorrect,
  renderComplete,
}: QuizProps) {
  const { t } = useTranslation('moduleTools')
  const total = questions.length
  const [questionIndex, setQuestionIndex] = useState(() => {
    const firstIncomplete = questions.findIndex(
      (entry) => !completedQuestionIds.includes(entry.id),
    )

    return firstIncomplete === -1 ? total : firstIncomplete
  })
  const [selected, setSelected] = useState<number | null>(null)

  const question = questions[questionIndex]

  if (!question) {
    return renderComplete({
      restart: () => {
        setSelected(null)
        setQuestionIndex(0)
      },
    })
  }

  const isCorrect = selected !== null && selected === question.correctIndex
  const isLastQuestion = questionIndex === total - 1

  const chooseOption = (optionIndex: number) => {
    setSelected(optionIndex)

    if (optionIndex === question.correctIndex) {
      onQuestionCorrect?.(question)
    }
  }

  const goToNext = () => {
    setSelected(null)
    setQuestionIndex((index) => index + 1)
  }

  return (
    <div className="panel space-y-6">
      {total > 1 && (
        <p className="text-sm font-semibold text-pine">
          {t('quiz.progress', { current: questionIndex + 1, total })}
        </p>
      )}
      <fieldset>
        <legend className="mb-4 text-xl font-semibold">
          {question.prompt}
        </legend>
        {question.media && <div className="mb-4">{question.media}</div>}
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
          (isCorrect ? question.correctFeedback : question.incorrectFeedback)}
      </p>
      {isCorrect && (
        <button type="button" className="button" onClick={goToNext}>
          {t(isLastQuestion ? 'quiz.finish' : 'quiz.next')}
        </button>
      )}
    </div>
  )
}
