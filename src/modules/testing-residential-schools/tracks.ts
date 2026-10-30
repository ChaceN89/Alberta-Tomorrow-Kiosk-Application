/**
  File: tracks.ts | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Define the two audio tracks and their completion checkpoints.

  Usage:
  - The map info panel and journal replay action use these shared tracks.

  Notes:
  - The Blood school track intentionally has no cover art to exercise the shared fallback.
 */
import type { AudioTrack } from '@/module-tools/media-player/provider/types'
import lesserSlaveLakeCover from './assets/lesser-slave-lake-audio-cover.jpg'
import bloodSchoolAudio from './assets/blood-school-song.mp3'
import lesserSlaveLakeAudio from './assets/lesser-slave-lake-ambient.mp3'

export const bloodSchoolAudioTrack = {
  type: 'audio',
  id: 'residential-schools-blood-song',
  src: bloodSchoolAudio,
  title: 'Instrumental music',
  subtitle: 'Residential schools in Alberta',
  translation: {
    namespace: 'residentialSchool',
    titleKey: 'activity.media.bloodAudio.title',
    subtitleKey: 'title',
  },
} satisfies AudioTrack

export const lesserSlaveLakeAudioTrack = {
  type: 'audio',
  id: 'residential-schools-lesser-slave-lake-ambient',
  src: lesserSlaveLakeAudio,
  coverArt: lesserSlaveLakeCover,
  title: 'Ambient instrumental',
  subtitle: 'Residential schools in Alberta',
  translation: {
    namespace: 'residentialSchool',
    titleKey: 'activity.media.lesserSlaveLakeAudio.title',
    subtitleKey: 'title',
  },
} satisfies AudioTrack
