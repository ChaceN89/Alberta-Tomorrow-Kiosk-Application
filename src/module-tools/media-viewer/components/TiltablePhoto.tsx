/**
  File: TiltablePhoto.tsx | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Show an image as large as its area allows, as a photo that tilts in 3D when pressed.

  Usage:
  - Rendered by ImageViewerBody.

  Notes:
  - The frame is sized to the image's own proportions so the tilt hugs the picture, not
    the letterboxed area around it. Styles are in MediaViewer.css.
 */
import { useState, type CSSProperties } from 'react'
import { TiltStage } from './TiltStage'

type TiltablePhotoProps = {
  src: string
  alt: string
}

const DEFAULT_RATIO = 3 / 2

export function TiltablePhoto({ src, alt }: TiltablePhotoProps) {
  const [ratio, setRatio] = useState(DEFAULT_RATIO)

  return (
    <TiltStage
      surfaceClassName="media-viewer-photo"
      surfaceStyle={{ '--photo-ratio': ratio } as CSSProperties}
    >
      <img
        src={src}
        alt={alt}
        draggable={false}
        className="block size-full"
        onLoad={(event) =>
          setRatio(
            event.currentTarget.naturalWidth /
              event.currentTarget.naturalHeight,
          )
        }
      />
    </TiltStage>
  )
}
