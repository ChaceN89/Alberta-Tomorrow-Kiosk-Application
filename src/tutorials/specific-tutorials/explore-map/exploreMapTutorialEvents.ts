/**
  File: exploreMapTutorialEvents.ts | Author: Chace Nielson
  Date Created: Nov 5, 2026
  Date Updated: Nov 5, 2026

  Description:
  - Let developer tools start the Explore map tutorial on an active map route.

  Usage:
  - Developer tools dispatch the request; ExploreMapTutorial handles it.

  Notes:
  - The caller resets the saved completion flag before requesting a restart.
 */
export const EXPLORE_MAP_TUTORIAL_START_REQUEST =
  'explore-map-tutorial:start-request'
export const EXPLORE_MAP_TUTORIAL_FINISH_REQUEST =
  'explore-map-tutorial:finish-request'

export function requestExploreMapTutorialStart() {
  window.dispatchEvent(new Event(EXPLORE_MAP_TUTORIAL_START_REQUEST))
}
