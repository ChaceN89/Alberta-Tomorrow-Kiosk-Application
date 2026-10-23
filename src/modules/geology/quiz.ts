/**
 * File: quiz.ts | Author: Chace Nielson
 * Created: 2026-10-23 | Updated: 2026-10-23
 * Description: Checkpoint ids and correct answers for the geology quiz.
 * Notes: Order matches activity.questions and journal.entries in module.geology.json.
 */
export const geologyCheckpoints = [
  'badlands',
  'glacial-boulder',
  'oil-sands',
] as const

// Index of the correct option for each question, in checkpoint order.
export const geologyCorrectOptions = [1, 1, 0] as const
