/**
  File: mediaPlayerTutorialEvents.ts | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Let player controls dismiss the first-use tutorial when learners start playback.

  Usage:
  - Playback buttons dispatch this request; MediaPlayerTutorial handles it.

  Notes:
  - The event is only dispatched from browser interaction handlers.
 */
export const MEDIA_PLAYER_TUTORIAL_PLAY_REQUEST =
  'media-player-tutorial:play-request'

export function requestMediaPlayerTutorialDismissalForPlayback() {
  window.dispatchEvent(new Event(MEDIA_PLAYER_TUTORIAL_PLAY_REQUEST))
}
