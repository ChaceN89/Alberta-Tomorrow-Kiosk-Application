/**
  File: TiltStage.tsx | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Provide a stage with perspective and a surface that tilts in 3D when pressed.

  Usage:
  - Wrapped around a photo or a note by TiltablePhoto and MessageViewerBody.

  Notes:
  - surfaceClassName and surfaceStyle size and decorate the surface; the tilt, shadow,
    and glare come from the shared media-viewer-tilt styles in MediaViewer.css.
  - Tilt is a pointer-only extra; the content inside stays fully readable.
 */
import type { CSSProperties, ReactNode } from 'react'
import { useTilt } from '../hooks/useTilt'

type TiltStageProps = {
  surfaceClassName: string
  surfaceStyle?: CSSProperties
  children: ReactNode
}

export function TiltStage({
  surfaceClassName,
  surfaceStyle,
  children,
}: TiltStageProps) {
  const { stageRef, surfaceRef, handlers } = useTilt()

  return (
    <div
      ref={stageRef}
      className="media-viewer-stage min-h-0 flex-1 bg-canvas p-3 md:p-5"
    >
      <div
        ref={surfaceRef}
        className={`media-viewer-tilt ${surfaceClassName}`}
        style={surfaceStyle}
        {...handlers}
      >
        {children}
        <span aria-hidden="true" className="media-viewer-tilt__glare" />
      </div>
    </div>
  )
}
