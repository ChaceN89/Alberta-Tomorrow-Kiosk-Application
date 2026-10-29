/**
  File: toasterIds.ts | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Define ids for the application's status and notification toast containers.

  Usage:
  - Shared by GlobalOverlayLayer and toast calls throughout the app.

  Notes:
  - The toasterId selects a container; reuse a toast id only for intentional updates.
 */
export const STATUS_TOASTER_ID = 'status'
export const NOTIFICATION_TOASTER_ID = 'notification'
export const ACTIVITY_PRELOAD_TOAST_ID = 'activity-preload'
