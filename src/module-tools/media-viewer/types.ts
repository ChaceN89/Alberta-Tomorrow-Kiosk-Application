/**
  File: types.ts | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Define content shapes supported by the shared media viewer.

  Usage:
  - Used by MediaViewerProvider and modules that open viewer content.

  Notes:
  - Keep media-specific content separate from module checkpoint behavior.
 */
export type MessageViewerContent = {
  title: string
  subtitle?: string
  message: string
}

export type ImageViewerContent = {
  title: string
  description: string
  src: string
  alt: string
}

export type MediaViewerContent =
  | ({ type: 'message' } & MessageViewerContent)
  | ({ type: 'image' } & ImageViewerContent)
