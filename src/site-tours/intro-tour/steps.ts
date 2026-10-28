/**
  File: steps.ts | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 23, 2026

  Description:
  - Define the ordered steps of the first-visit intro tour.

  Usage:
  - Journal and intro-tour internals serve their providers or components.

  Notes:
  - Step ids match top-level keys in introTour.json; anchors match data-tour attributes.
 */
export type TourAnchor = 'expedition-list' | 'journal-button'

export type TourStep =
  | { id: 'welcome' | 'finish' }
  | {
      id: 'expeditions' | 'journal'
      anchor: TourAnchor
      placement: 'above' | 'below'
    }

export const tourSteps: readonly TourStep[] = [
  { id: 'welcome' },
  { id: 'expeditions', anchor: 'expedition-list', placement: 'above' },
  { id: 'journal', anchor: 'journal-button', placement: 'below' },
  { id: 'finish' },
]
