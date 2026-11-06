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
import {
  redFoxDietQuizQuestionCheckpoint,
  redFoxSoundQuizQuestionCheckpoint,
  swiftFoxHabitatQuizQuestionCheckpoint,
} from '../journal/checkpoints'

export const foxesOfAlbertaQuizQuestions = [
  {
    id: swiftFoxHabitatQuizQuestionCheckpoint,
    correctOptionId: 'shortgrass-prairie',
  },
  {
    id: redFoxDietQuizQuestionCheckpoint,
    correctOptionId: 'small-animals-and-plants',
  },
  {
    id: redFoxSoundQuizQuestionCheckpoint,
    correctOptionId: 'red-fox',
  },
] as const satisfies readonly QuizQuestionDefinition[]
