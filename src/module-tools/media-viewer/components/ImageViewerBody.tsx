/**
  File: ImageViewerBody.tsx | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Show an image as large as the dialog allows, with its description above it.

  Usage:
  - Rendered by MediaViewerDialog for image content.

  Notes:
  - A long description is clamped; expanding it gives the image less room.
  - The image is a TiltablePhoto: pressing and dragging tilts it in 3D.
 */
import type { ImageViewerContent } from '../provider/types'
import { ExpandableText } from './ExpandableText'
import { TiltablePhoto } from './TiltablePhoto'

type ImageViewerBodyProps = {
  content: ImageViewerContent
}

export function ImageViewerBody({ content }: ImageViewerBodyProps) {
  return (
    <>
      {content.description && (
        <div className="shrink-0 border-b border-line px-4 py-3 md:px-6">
          <ExpandableText text={content.description} />
        </div>
      )}
      <TiltablePhoto src={content.src} alt={content.alt} />
    </>
  )
}
