/**
  File: steps.ts | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Define the first-use media player tutorial and its player anchors.

  Usage:
  - MediaPlayerTutorial renders the ordered steps.

  Notes:
  - Step ids match the mediaPlayer object in tutorials.json.
 */
export type MediaPlayerTutorialAnchor =
  'player-tabs' | 'player-tab' | 'player-controls'

export type MediaPlayerTutorialStep = {
  id: 'player' | 'open' | 'controls'
  anchor: MediaPlayerTutorialAnchor
  placement: 'above' | 'below'
}

export const mediaPlayerTutorialSteps: readonly MediaPlayerTutorialStep[] = [
  { id: 'player', anchor: 'player-tabs', placement: 'above' },
  { id: 'open', anchor: 'player-tab', placement: 'above' },
  { id: 'controls', anchor: 'player-controls', placement: 'above' },
]
