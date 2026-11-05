/**
  File: steps.ts | Author: Chace Nielson
  Date Created: Nov 5, 2026
  Date Updated: Nov 5, 2026

  Description:
  - Define the ordered introduction to map exploration and its controls.

  Usage:
  - ExploreMapTutorial renders these steps after the map is ready.

  Notes:
  - Popover anchors match data-tutorial attributes in MapActionControls.
 */
export type ExploreMapTutorialStep =
  | { id: 'overview'; mode: 'dialog' }
  | {
      id: 'viewToggle' | 'flyPlane'
      mode: 'popover'
      anchor: 'map-view-toggle' | 'fly-plane'
      placement: 'above'
    }

export const exploreMapTutorialSteps: readonly ExploreMapTutorialStep[] = [
  { id: 'overview', mode: 'dialog' },
  {
    id: 'viewToggle',
    mode: 'popover',
    anchor: 'map-view-toggle',
    placement: 'above',
  },
  {
    id: 'flyPlane',
    mode: 'popover',
    anchor: 'fly-plane',
    placement: 'above',
  },
]
