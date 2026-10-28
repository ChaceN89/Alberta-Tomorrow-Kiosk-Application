/**
 * File: initializeApp.ts | Author: Chace Nielson
 * Created: 2026-10-23 | Updated: 2026-10-23
 * Description: Run app-wide startup work before the initial screen is revealed.
 * Dependencies: Browser timers; shared data requests can be added here.
 *
 * IF i wanted to load something specific here (Images, media, map data etc), i could run a custom initialization routine within this component.
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
