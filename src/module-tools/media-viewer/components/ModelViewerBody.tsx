/**
  File: ModelViewerBody.tsx | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Present 3D models inside the shared media viewer.

  Usage:
  - Lazy-loaded by MediaViewerDialog for model content.

  Notes:
  - The journal uses a static preview and only loads the model after it is opened.
 */
import type { ModelViewerContent } from '../provider/types'
import { ModelViewerCanvas } from './ModelViewerCanvas'

type ModelViewerBodyProps = {
  content: ModelViewerContent
}

export function ModelViewerBody({ content }: ModelViewerBodyProps) {
  return <ModelViewerCanvas content={content} />
}
