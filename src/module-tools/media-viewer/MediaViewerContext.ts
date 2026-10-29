/**
  File: MediaViewerContext.ts | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Share viewer open state and actions between its provider and consumers.

  Usage:
  - Imported by MediaViewerProvider and useMediaViewer.

  Notes:
  - Consumers should use the useMediaViewer hook instead of this context.
 */
import { createContext } from 'react'
import type { ImageViewerContent, MessageViewerContent } from './types'

export type MediaViewerContextValue = {
  isOpen: boolean
  openMessage: (content: MessageViewerContent, onOpen?: () => void) => void
  openImage: (content: ImageViewerContent, onOpen?: () => void) => void
}

export const MediaViewerContext = createContext<MediaViewerContextValue | null>(
  null,
)
