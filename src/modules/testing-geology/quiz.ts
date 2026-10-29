/**
  File: quiz.ts | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Stable question and correct-option ids for geology quiz questions.

  Usage:
  - entry-Geology combines these definitions with localized question content.

  Notes:
  - Question ids also identify their localized content and journal checkpoints.
 */
import type { QuizQuestionDefinition } from '../../module-tools/quiz-system/types'

export const geologyQuizQuestions = [
  {
    id: 'badlands',
    correctOptionId: 'red-deer-river-valley',
  },
  {
    id: 'glacial-boulder',
    correctOptionId: 'glacial-ice',
  },
  {
    id: 'oil-sands',
    correctOptionId: 'northern-alberta',
  },
] as const satisfies readonly QuizQuestionDefinition[]
