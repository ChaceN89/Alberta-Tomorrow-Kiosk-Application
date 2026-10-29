/**
  File: types.ts | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Define the question shape shared by every module that uses the quiz system.

  Usage:
  - Modules build QuizQuestion objects from their own translated content and pass them to Quiz.

  Notes:
  - Reusing a question's id as its journal checkpoint id lets Quiz resume where a learner left off.
 */
import type { ReactNode } from 'react'

export type QuizQuestionDefinition = {
  id: string
  correctOptionId: string
}

export type LocalizedQuizQuestion = {
  prompt: string
  options: Readonly<Record<string, string>>
  correct: string
  tryAgain: string
}

export type QuizOption = {
  id: string
  text: string
}

export type QuizQuestion = {
  id: string
  prompt: string
  media?: ReactNode
  options: readonly QuizOption[]
  correctOptionId: string
  correctFeedback: string
  incorrectFeedback: string
}
