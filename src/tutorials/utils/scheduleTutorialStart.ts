/**
  File: scheduleTutorialStart.ts | Author: Chace Nielson
  Date Created: Nov 5, 2026
  Date Updated: Nov 5, 2026

  Description:
  - Schedule a tutorial start after an optional delay.

  Usage:
  - Call from a tutorial effect and return the cleanup function.

  Notes:
  - The default delay is zero.
 */
export function scheduleTutorialStart(startTutorial: () => void, delayMs = 0) {
  const timer = window.setTimeout(startTutorial, Math.max(0, delayMs))

  return () => window.clearTimeout(timer)
}
