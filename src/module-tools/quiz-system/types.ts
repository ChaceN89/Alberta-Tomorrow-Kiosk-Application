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

export type QuizQuestion = {
  id: string
  prompt: string
  audio?: ReactNode
  options: readonly string[]
  correctIndex: number
  correctFeedback: string
  incorrectFeedback: string
}
