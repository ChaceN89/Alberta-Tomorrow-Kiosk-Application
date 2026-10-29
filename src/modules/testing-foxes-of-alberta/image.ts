/**
  File: image.ts | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Provide the fox family image asset and localized viewer content keys.

  Usage:
  - ViewerExamples opens this image in the shared media viewer.

  Notes:
  - The image itself is stored in the module's assets folder.
 */
import foxFamilyImageSrc from './assets/fox-family.png'

export const foxFamilyImage = {
  src: foxFamilyImageSrc,
  title: 'viewer.image.title',
  description: 'viewer.image.description',
  alt: 'viewer.image.alt',
} as const
