/**
  File: steps.ts | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Define the ordered steps of the first-visit intro tutorial.

  Usage:
  - Tutorial internals serve their providers or components.

  Notes:
  - Step ids match top-level keys in tutorials.json; anchors match data-tutorial attributes.
 */
export type TutorialAnchor = 'expedition-list' | 'journal-button'

export type TutorialStep =
  | { id: 'welcome' | 'finish' }
  | {
      id: 'expeditions' | 'journal'
      anchor: TutorialAnchor
      placement: 'above' | 'below'
    }

export const introTutorialSteps: readonly TutorialStep[] = [
  { id: 'welcome' },
  { id: 'expeditions', anchor: 'expedition-list', placement: 'above' },
  { id: 'journal', anchor: 'journal-button', placement: 'below' },
  { id: 'finish' },
]
