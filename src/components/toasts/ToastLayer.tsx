/**
  File: ToastLayer.tsx | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Render one stable toast container: status or notification.

  Usage:
  - Render each layer once inside GlobalOverlayLayer.

  Notes:
  - Status toasts stay in the page, below the journal and media tools.
  - Notification toasts sit above them; the parent moves their host into an active modal.
 */
import { Toaster } from 'react-hot-toast'
import { NOTIFICATION_TOASTER_ID, STATUS_TOASTER_ID } from './toasterIds'

type ToastLayerProps = {
  layer: 'status' | 'notification'
}

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
  duration: 2000,
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
  duration: 3500,
}

export function ToastLayer({ layer }: ToastLayerProps) {
  return layer === 'status' ? (
    <Toaster
      toasterId={STATUS_TOASTER_ID}
      position="top-center"
      containerStyle={{ top: 80, zIndex: 'var(--z-status-toast)' }}
      toastOptions={statusToastOptions}
    />
  ) : (
    <Toaster
      toasterId={NOTIFICATION_TOASTER_ID}
      position="top-left"
      containerStyle={{ top: 40, zIndex: 'var(--z-notification-toast)' }}
      toastOptions={notificationToastOptions}
    />
  )
}
