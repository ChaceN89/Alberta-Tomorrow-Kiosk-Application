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
  - Preserves question order and shuffles answer choices on entry and restart.
  - Completed questions are skipped on entry, preserving the learner's place.
  - Wrong answers can be retried; a correct answer locks the options and offers Next or Finish.
 */
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { QuizQuestion } from './types'

function shuffleOptionIds(
  question: QuizQuestion,
  previousOrder?: readonly string[],
) {
  const shuffledIds = question.options.map((option) => option.id)

  for (let index = shuffledIds.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    const currentId = shuffledIds[index]!
    shuffledIds[index] = shuffledIds[randomIndex]!
    shuffledIds[randomIndex] = currentId
  }

  const previousCorrectPosition = previousOrder?.indexOf(
    question.correctOptionId,
  )
  const correctPosition = shuffledIds.indexOf(question.correctOptionId)

  if (
    shuffledIds.length > 1 &&
    previousCorrectPosition !== undefined &&
    previousCorrectPosition >= 0 &&
    correctPosition === previousCorrectPosition
  ) {
    const newPosition = Math.floor(Math.random() * (shuffledIds.length - 1))
    const targetPosition =
      newPosition >= correctPosition ? newPosition + 1 : newPosition
    const targetOptionId = shuffledIds[targetPosition]!
    shuffledIds[targetPosition] = shuffledIds[correctPosition]!
    shuffledIds[correctPosition] = targetOptionId
  }

  return shuffledIds
}

function shuffleAnswerOrders(
  questions: readonly QuizQuestion[],
  previousOrders?: Readonly<Record<string, readonly string[]>>,
) {
  return Object.fromEntries(
    questions.map((question) => [
      question.id,
      shuffleOptionIds(question, previousOrders?.[question.id]),
    ]),
  )
}

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
  const [answerOrders, setAnswerOrders] = useState(() =>
    shuffleAnswerOrders(questions),
  )
  const total = questions.length
  const [questionIndex, setQuestionIndex] = useState(() => {
    const firstIncomplete = questions.findIndex(
      (entry) => !completedQuestionIds.includes(entry.id),
    )

    return firstIncomplete === -1 ? total : firstIncomplete
  })
  const [selected, setSelected] = useState<number | null>(null)

  const question = questions[questionIndex]
  const answerOrder = question
    ? (answerOrders[question.id] ?? question.options.map((option) => option.id))
    : []
  const displayedOptions = question
    ? answerOrder.map((optionId) => {
        const option = question.options.find((entry) => entry.id === optionId)

        if (!option) {
          throw new Error(
            `Quiz question "${question.id}" references missing option "${optionId}".`,
          )
        }

        return option
      })
    : []
  const correctOptionIndex = question
    ? answerOrder.indexOf(question.correctOptionId)
    : -1

  if (!question) {
    return renderComplete({
      restart: () => {
        setSelected(null)
        setAnswerOrders(shuffleAnswerOrders(questions, answerOrders))
        setQuestionIndex(0)
      },
    })
  }

  const isCorrect = selected !== null && selected === correctOptionIndex
  const isLastQuestion = questionIndex === total - 1

  const chooseOption = (optionIndex: number) => {
    setSelected(optionIndex)

    if (optionIndex === correctOptionIndex) {
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
          {displayedOptions.map((option, optionIndex) => (
            <button
              key={option.id}
              type="button"
              aria-pressed={selected === optionIndex}
              disabled={isCorrect}
              className="button-secondary"
              onClick={() => chooseOption(optionIndex)}
            >
              {option.text}
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
