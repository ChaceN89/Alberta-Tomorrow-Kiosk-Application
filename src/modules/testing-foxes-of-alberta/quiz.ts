/**
  File: quiz.ts | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Question ids, localized-content indexes, and correct answers for wildlife.

  Usage:
  - HabitatQuiz combines these definitions with localized question content.

  Notes:
  - Definition order matches quiz.questions; ids also identify journal checkpoints.
 */
import type { QuizQuestionDefinition } from '../../module-tools/quiz-system/types'

export const foxesOfAlbertaQuizQuestions = [
  {
    id: 'swift-fox-home',
    contentIndex: 0,
    correctIndex: 1,
  },
  {
    id: 'red-fox-food',
    contentIndex: 1,
    correctIndex: 1,
  },
  {
    id: 'red-fox-sound-identification',
    contentIndex: 2,
    correctIndex: 1,
  },
] as const satisfies readonly QuizQuestionDefinition[]
