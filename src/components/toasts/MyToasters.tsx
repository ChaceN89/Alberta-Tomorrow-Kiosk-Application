/**
  File: MyToasters.tsx | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Configure separate status and notification toast containers.
  - Keep shared toast styling in one place while each container uses its own position.

  Usage:
  - Rendered once by Layout; toast calls select a container by toasterId.

  Notes:
  - Status toasts appear at the top center; notifications appear at the bottom right.
 */
import { Toaster } from 'react-hot-toast'
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
  duration: 3000,
}

// exports multiple toaster containers so different toasts can access each type
export function MyToasters() {
  return (
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
}
