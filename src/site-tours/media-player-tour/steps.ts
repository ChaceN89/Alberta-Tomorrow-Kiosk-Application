/**
  File: steps.ts | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Define the first-use media player tour and its player anchors.

  Usage:
  - MediaPlayerTour renders the ordered steps.

  Notes:
  - Step ids match the mediaPlayer object in introTour.json.
 */
export type MediaPlayerTourAnchor =
  'player-tabs' | 'player-tab' | 'player-controls'

export type MediaPlayerTourStep = {
  id: 'player' | 'open' | 'controls'
  anchor: MediaPlayerTourAnchor
  placement: 'above' | 'below'
}

export const mediaPlayerTourSteps: readonly MediaPlayerTourStep[] = [
  { id: 'player', anchor: 'player-tabs', placement: 'above' },
  { id: 'open', anchor: 'player-tab', placement: 'above' },
  { id: 'controls', anchor: 'player-controls', placement: 'above' },
]
