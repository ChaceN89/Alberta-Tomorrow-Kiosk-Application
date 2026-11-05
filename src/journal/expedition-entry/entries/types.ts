/**
  File: types.ts | Author: Chace Nielson
  Date Created: Nov 5, 2026
  Date Updated: Nov 5, 2026

  Description:
  - Define the shared data shape used to render a translated journal entry.

  Usage:
  - Imported by the journal entry list and its row components.

  Notes:
  - IDs match checkpoints; section and image alt text are optional locale fields.
 */
export type JournalEntry = {
  id: string
  title: string
  summary: string
  section?: string
  imageAlt?: string
}
