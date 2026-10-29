/**
  File: checkpoints.ts | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Define the geology expedition's stable journal checkpoint ids.

  Usage:
  - The registry reads this list; the quiz uses matching question ids.

  Notes:
  - Keep ids aligned with journal.entries in module.geology.json.
 */
import { geologyQuizQuestions } from './quiz'

export const geologyVideoStartedCheckpoint = 'geology-video-started'
export const geologyQuizCompletedCheckpoint = 'geology-quiz-completed'

export const geologyCheckpoints = [
  geologyVideoStartedCheckpoint,
  geologyQuizCompletedCheckpoint,
  ...geologyQuizQuestions.map((question) => question.id), // map from quiz questions
]
