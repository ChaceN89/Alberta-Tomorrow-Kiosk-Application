/**
  File: formatTime.ts | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Format audio positions in seconds as m:ss.

  Usage:
  - Used by AudioPlayerPanel for the elapsed and total time labels.

  Notes:
  - None.
 */
export function formatTime(totalSeconds: number) {
  const seconds = Number.isFinite(totalSeconds)
    ? Math.max(0, Math.floor(totalSeconds))
    : 0

  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}
