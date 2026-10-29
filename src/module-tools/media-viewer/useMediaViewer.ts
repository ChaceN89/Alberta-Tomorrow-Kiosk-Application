/**
  File: useMediaViewer.ts | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Expose typed actions for opening message and image viewer content.

  Usage:
  - Call from components rendered within MediaViewerProvider.

  Notes:
  - Throws explicitly when used outside its required provider.
 */
import { useContext } from 'react'
import { MediaViewerContext } from './MediaViewerContext'

export function useMediaViewer() {
  const context = useContext(MediaViewerContext)

  if (!context) {
    throw new Error('useMediaViewer must be used within a MediaViewerProvider.')
  }

  return context
}
