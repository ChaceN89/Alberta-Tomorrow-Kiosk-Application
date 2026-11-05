/**
  File: mediaPlayerTutorialEvents.ts | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Let player controls and developer tools control the media player tutorial.

  Usage:
  - Playback and developer controls dispatch requests; MediaPlayerTutorial handles them.

  Notes:
  - The event is only dispatched from browser interaction handlers.
 */
export const MEDIA_PLAYER_TUTORIAL_PLAY_REQUEST =
  'media-player-tutorial:play-request'
export const MEDIA_PLAYER_TUTORIAL_START_REQUEST =
  'media-player-tutorial:start-request'
export const MEDIA_PLAYER_TUTORIAL_FINISH_REQUEST =
  'media-player-tutorial:finish-request'

export function requestMediaPlayerTutorialDismissalForPlayback() {
  window.dispatchEvent(new Event(MEDIA_PLAYER_TUTORIAL_PLAY_REQUEST))
}

export function requestMediaPlayerTutorialStart() {
  window.dispatchEvent(new Event(MEDIA_PLAYER_TUTORIAL_START_REQUEST))
}

export function requestMediaPlayerTutorialFinish() {
  window.dispatchEvent(new Event(MEDIA_PLAYER_TUTORIAL_FINISH_REQUEST))
}
