/**
  File: MyToasters.tsx | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Configure separate status and notification toast containers.
  - Portal them into the active overlay so toasts stay above modal and fullscreen UI.

  Usage:
  - Rendered once by Layout; toast calls select a container by toasterId.

  Notes:
  - Native modal dialogs require toast content to be inside the dialog's top layer.
 */
import { Toaster } from 'react-hot-toast'
import { createPortal } from 'react-dom'
import { useAudioPlayer } from '@/module-tools/media-player/useAudioPlayer'
import { useMediaViewer } from '@/module-tools/media-viewer/useMediaViewer'
import { NOTIFICATION_TOASTER_ID, STATUS_TOASTER_ID } from './toasterIds'

const sharedToastStyle = {
  style: {
    backgroundColor: 'var(--color-surface)',
    border: '1px solid var(--color-line)',
    borderRadius: '12px',
    color: 'var(--color-ink)',
    width: 'max-content',
    maxWidth: 'calc(100vw - 2rem)',
  },
}

const statusToastOptions = {
  ...sharedToastStyle,
  duration: 2500,
  loading: {
    iconTheme: {
      primary: 'var(--color-pine)',
      secondary: 'var(--color-surface)',
    },
  },
  error: { duration: 5000 },
}

const notificationToastOptions = {
  ...sharedToastStyle,
  duration: 2000,
}

// exports multiple toaster containers so different toasts can access each type
export function MyToasters() {
  const { isFullscreen } = useAudioPlayer()
  const { isOpen: isMediaViewerOpen } = useMediaViewer()
  const toastRootId = isMediaViewerOpen
    ? 'media-viewer-toast-root'
    : isFullscreen
      ? 'audio-player-toast-root'
      : null
  const toastRoot = toastRootId ? document.getElementById(toastRootId) : null

  if (toastRootId && !toastRoot) {
    throw new Error(
      `The active overlay toast root "${toastRootId}" is missing.`,
    )
  }

  const toasters = (
    <>
      <Toaster
        toasterId={STATUS_TOASTER_ID}
        position="top-center"
        containerStyle={{ top: 80 }}
        toastOptions={statusToastOptions}
      />
      <Toaster
        toasterId={NOTIFICATION_TOASTER_ID}
        position="top-left"
        containerStyle={{ bottom: 80 }}
        toastOptions={notificationToastOptions}
      />
    </>
  )

  return toastRoot ? createPortal(toasters, toastRoot) : toasters
}
