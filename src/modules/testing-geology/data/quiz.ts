/**
  File: quiz.ts | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Stable question and correct-option ids for geology quiz questions.

  Usage:
  - ActivityPage combines these definitions with localized question content.

  Notes:
  - Question ids also identify their localized content and journal checkpoints.
 */
import type { QuizQuestionDefinition } from '@/module-tools/quiz-system/types'
import {
  badlandsQuizQuestionCheckpoint,
  glacialBoulderQuizQuestionCheckpoint,
  oilSandsQuizQuestionCheckpoint,
} from '../journal/checkpoints'

export const geologyQuizQuestions = [
  {
    id: badlandsQuizQuestionCheckpoint,
    correctOptionId: 'red-deer-river-valley',
  },
  {
    id: glacialBoulderQuizQuestionCheckpoint,
    correctOptionId: 'glacial-ice',
  },
  {
    id: oilSandsQuizQuestionCheckpoint,
    correctOptionId: 'northern-alberta',
  },
] as const satisfies readonly QuizQuestionDefinition[]
