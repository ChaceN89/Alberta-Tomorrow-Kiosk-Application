/**
  File: mediaPlayerTourEvents.ts | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Let player controls dismiss the first-use tour when learners start playback.

  Usage:
  - Playback buttons dispatch this request; MediaPlayerTour handles it.

  Notes:
  - The event is only dispatched from browser interaction handlers.
 */
export const MEDIA_PLAYER_TOUR_PLAY_REQUEST = 'media-player-tour:play-request'

export function requestMediaPlayerTourDismissalForPlayback() {
  window.dispatchEvent(new Event(MEDIA_PLAYER_TOUR_PLAY_REQUEST))
}
