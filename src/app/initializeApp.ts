/**
  File: initializeApp.ts | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Provide an awaitable place for app-wide setup and maintain the minimum splash duration.
  - Map readiness is coordinated separately by AppStartup.

  Usage:
  - Called by AppStartup before it waits for any route-specific startup dependencies.

  Notes:
  - Add app-wide startup work here when it must complete before the splash exits.
 */
const MINIMUM_SPLASH_DURATION_MS = 1000

export async function initializeApp(): Promise<void> {
  // Add app-wide setup here when startup work needs to finish before the app is shown.

  // Keep the splash screen visible for at least the minimum duration specified.
  await new Promise<void>((resolve) => {
    window.setTimeout(resolve, MINIMUM_SPLASH_DURATION_MS)
  })
}
