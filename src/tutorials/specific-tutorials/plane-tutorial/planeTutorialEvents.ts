/**
  File: planeTutorialEvents.ts | Author: Chace Nielson
  Date Created: Nov 5, 2026
  Date Updated: Nov 5, 2026

  Description:
  - Let developer tools start or restart the first-flight tutorial.

  Usage:
  - Developer tools dispatch the request; AlbertaMap starts the flight and tutorial.

  Notes:
  - The event is only dispatched from browser interaction handlers.
 */
export const PLANE_TUTORIAL_START_REQUEST = 'plane-tutorial:start-request'

export function requestPlaneTutorialStart() {
  window.dispatchEvent(new Event(PLANE_TUTORIAL_START_REQUEST))
}
