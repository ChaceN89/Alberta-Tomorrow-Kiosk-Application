/**
  File: audio.ts | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Audio files, cover art, and checkpoint ids for the wildlife expedition's listening clips.
  - Titles and descriptions live in module.wildlifeFinder.json under listen.tracks.

  Usage:
  - Activity and journal components hand these tracks to the shared audio player.

  Notes:
  - The test song records start and finish, the narration records finish, and the red fox sound records start.
 */
import narrationCover from '../assets/cover-narration.jpg'
import redFoxCover from '../assets/cover-red-fox.png'
import songCover from '../assets/cover-song.jpg'
import narrationSrc from '../assets/audio-narration.m4a'
import redFoxSrc from '../assets/audio-red-fox.mp3'
import songSrc from '../assets/audio-song.mp3'
import {
  foxNarrationFinishedCheckpoint,
  foxRedFoxSoundStartedCheckpoint,
  foxSongFinishedCheckpoint,
  foxSongStartedCheckpoint,
} from '../journal/checkpoints'

export const foxesOfAlbertaTracks = [
  {
    key: 'song',
    id: 'foxes-of-alberta-song',
    src: songSrc,
    coverArt: songCover,
    startCheckpoint: foxSongStartedCheckpoint,
    endCheckpoint: foxSongFinishedCheckpoint,
  },
  {
    key: 'narration',
    id: 'foxes-of-alberta-narration',
    src: narrationSrc,
    coverArt: narrationCover,
    endCheckpoint: foxNarrationFinishedCheckpoint,
  },
  {
    key: 'redFoxSound',
    id: 'foxes-of-alberta-red-fox-sound',
    src: redFoxSrc,
    coverArt: redFoxCover,
    startCheckpoint: foxRedFoxSoundStartedCheckpoint,
  },
] as const
