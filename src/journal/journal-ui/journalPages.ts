/**
  File: journalPages.ts | Author: Chace Nielson
  Date Created: Nov 9, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Model title, Alberta discovery, and expedition pages without fake modules.

  Usage:
  - Shared by journal navigation, provider, and modal.

  Notes:
  - The Alberta page ID is a journal destination only, never a module ID.
 */
import type { LearningModule } from '@/modules/types'

export const ALBERTA_JOURNAL_PAGE_ID = 'alberta-map'

export type JournalPage =
  | { kind: 'title'; id: null }
  | { kind: 'alberta'; id: typeof ALBERTA_JOURNAL_PAGE_ID }
  | { kind: 'expedition'; id: string; module: LearningModule }
