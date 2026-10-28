/**
  File: quiz.ts | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 23, 2026

  Description:
  - Checkpoint ids and correct answers for the geology quiz.

  Usage:
  - Module data files are used by their activity.

  Notes:
  - Order matches activity.questions and journal.entries in module.geology.json.
 */
export const geologyCheckpoints = [
  'badlands',
  'glacial-boulder',
  'oil-sands',
] as const

// Index of the correct option for each question, in checkpoint order.
export const geologyCorrectOptions = [1, 1, 0] as const
