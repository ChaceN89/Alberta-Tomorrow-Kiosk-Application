/**
  File: types.ts | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Define message, image, and 3D model content for the shared media viewer.

  Usage:
  - Used by MediaViewerProvider and modules that open viewer content.

  Notes:
  - Keep media-specific content separate from module checkpoint behavior.
 */
export type MessageViewerContent = {
  title: string
  subtitle?: string
  message: string
  // Small doodles drawn side by side at the bottom of the note.
  images?: readonly {
    src: string
    alt: string
  }[]
}

export type ImageViewerContent = {
  title: string
  description: string
  src: string
  alt: string
}

export type ModelViewerContent = {
  title: string
  description?: string
  src: string
  textureUrl?: string
}

export type MediaViewerContent =
  | ({ type: 'message' } & MessageViewerContent)
  | ({ type: 'image' } & ImageViewerContent)
  | ({ type: 'model' } & ModelViewerContent)

export type MediaViewerOpenOptions = {
  // Runs when the viewer opens, e.g. to complete a checkpoint.
  onOpen?: () => void
  // The clicked element; the viewer grows out of it and falls back to the center.
  origin?: Element | null
}

// Where the viewer grows from: the center and size of the clicked element, in viewport pixels.
export type ViewerOrigin = {
  x: number
  y: number
  width: number
  height: number
  // Lets closing return to the element's position at that moment.
  element?: Element
}
