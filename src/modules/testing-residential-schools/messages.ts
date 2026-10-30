/**
  File: messages.ts | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Define the fictional test message and its supplied image.

  Usage:
  - The map info panel and journal message viewer resolve the locale keys.

  Notes:
  - The note is explicitly identified as fictional, not as a historical record or testimony.
 */
import stAlbertSchoolPhoto from './assets/st-albert-school-photo.png'

export const stAlbertSampleMessage = {
  title: 'activity.media.stAlbertMessage.title',
  subtitle: 'activity.media.stAlbertMessage.subtitle',
  message: 'activity.media.stAlbertMessage.body',
  images: [
    {
      src: stAlbertSchoolPhoto,
      alt: 'activity.media.stAlbertMessage.imageAlt',
    },
  ],
} as const
