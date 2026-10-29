/**
  File: quiz.ts | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Localized-content indexes and correct answers for geology quiz questions.

  Usage:
  - entry-Geology combines these definitions with localized question content.

  Notes:
  - Definition order matches activity.questions; question ids live in checkpoints.ts.
 */
import type { QuizQuestionDefinition } from '../../module-tools/quiz-system/types'

export const geologyQuizQuestions = [
  {
    id: 'badlands',
    contentIndex: 0,
    correctIndex: 1,
  },
  {
    id: 'glacial-boulder',
    contentIndex: 1,
    correctIndex: 1,
  },
  {
    id: 'oil-sands',
    contentIndex: 2,
    correctIndex: 0,
  },
] as const satisfies readonly QuizQuestionDefinition[]
