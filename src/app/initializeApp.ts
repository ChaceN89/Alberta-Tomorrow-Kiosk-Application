/**
  File: initializeApp.ts | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 23, 2026

  Description:
  - Provide an awaitable place for setup that must finish before the application appears.
  - Currently keeps the splash screen visible for at least one second; future startup data
    requests can be awaited here before the application is revealed.

  Usage:
  - Called by AppStartup; return only after required startup work is complete.

  Notes:
  - None.
 */
const MINIMUM_SPLASH_DURATION_MS = 1000

export async function initializeApp(): Promise<void> {
  // Add app-wide setup here when startup work needs to finish before the app is shown.

  // Keep the splash screen visible for at least the minimum duration specified.
  await new Promise<void>((resolve) => {
    window.setTimeout(resolve, MINIMUM_SPLASH_DURATION_MS)
  })

  // Await shared app-data requests here when needed, such as map data.
}
