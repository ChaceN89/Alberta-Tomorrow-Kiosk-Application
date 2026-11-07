/**
  File: quiz.ts | Author: Chace Nielson
  Date Created: Nov 6, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Define Frank Slide quiz question ids and correct options.

  Usage:
  - ActivityPage combines these definitions with localized question content.

  Notes:
  - Question ids also identify their journal checkpoints.
 */
import type { QuizQuestionDefinition } from '@/module-tools/quiz-system/types'
import {
  frankSlideDateQuizCheckpoint,
  frankSlideEventQuizCheckpoint,
  frankSlideLocationQuizCheckpoint,
  frankSlideMountainQuizCheckpoint,
} from '../journal/checkpoints'

export const frankSlideQuizQuestions = [
  {
    id: frankSlideEventQuizCheckpoint,
    correctOptionId: 'turtle-mountain-rock-avalanche',
  },
  {
    id: frankSlideMountainQuizCheckpoint,
    correctOptionId: 'turtle-mountain',
  },
  {
    id: frankSlideDateQuizCheckpoint,
    correctOptionId: 'april-29-1903',
  },
  {
    id: frankSlideLocationQuizCheckpoint,
    correctOptionId: 'crowsnest-pass',
  },
] as const satisfies readonly QuizQuestionDefinition[]
