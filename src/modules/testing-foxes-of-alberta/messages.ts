/**
  File: messages.ts | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Identify localized reading content used by the Alberta foxes expedition.

  Usage:
  - ViewerExamples resolves these content keys and opens them with the shared viewer.

  Notes:
  - The message wording is stored in both module locale files.
  - A message can carry small doodle images, drawn side by side at the bottom of its note.
 */
import foxDenImageSrc from './assets/fox-den.png'
import foxTracksImageSrc from './assets/fox-tracks.png'

export const foxFieldMessage = {
  title: 'viewer.message.title',
  subtitle: 'viewer.message.subtitle',
  message: 'viewer.message.body',
} as const

export const foxFieldList = {
  title: 'viewer.list.title',
  subtitle: 'viewer.list.subtitle',
  message: 'viewer.list.body',
  images: [
    { src: foxTracksImageSrc, alt: 'viewer.list.tracksImageAlt' },
    { src: foxDenImageSrc, alt: 'viewer.list.denImageAlt' },
  ],
} as const
