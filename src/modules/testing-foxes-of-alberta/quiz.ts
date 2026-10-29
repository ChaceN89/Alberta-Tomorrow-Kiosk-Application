/**
  File: quiz.ts | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Stable question and correct-option ids for wildlife quiz questions.

  Usage:
  - HabitatQuiz combines these definitions with localized question content.

  Notes:
  - Question ids also identify their localized content and journal checkpoints.
 */
import type { QuizQuestionDefinition } from '@/module-tools/quiz-system/types'

export const foxesOfAlbertaQuizQuestions = [
  {
    id: 'swift-fox-home',
    correctOptionId: 'shortgrass-prairie',
  },
  {
    id: 'red-fox-food',
    correctOptionId: 'small-animals-and-plants',
  },
  {
    id: 'red-fox-sound-identification',
    correctOptionId: 'red-fox',
  },
] as const satisfies readonly QuizQuestionDefinition[]
