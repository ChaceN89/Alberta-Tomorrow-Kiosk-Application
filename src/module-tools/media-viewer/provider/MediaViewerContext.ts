/**
  File: MediaViewerContext.ts | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Share viewer open state and typed media-opening actions with consumers.

  Usage:
  - Imported by MediaViewerProvider and useMediaViewer.

  Notes:
  - Consumers should use the useMediaViewer hook instead of this context.
 */
import { createContext } from 'react'
import type {
  ImageViewerContent,
  MediaViewerOpenOptions,
  MessageViewerContent,
  ModelViewerContent,
} from './types'

export type MediaViewerContextValue = {
  isOpen: boolean
  openMessage: (
    content: MessageViewerContent,
    options?: MediaViewerOpenOptions,
  ) => void
  openImage: (
    content: ImageViewerContent,
    options?: MediaViewerOpenOptions,
  ) => void
  openModel: (
    content: ModelViewerContent,
    options?: MediaViewerOpenOptions,
  ) => void
}

export const MediaViewerContext = createContext<MediaViewerContextValue | null>(
  null,
)
