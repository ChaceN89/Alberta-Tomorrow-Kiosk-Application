/**
  File: playbackRates.ts | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Define the speed steps for the audio player's fast and slow buttons.

  Usage:
  - Used by AudioPlayerProvider to pick the next playback rate.

  Notes:
  - Each button cycles through its own steps and returns to normal speed after the last one.
  - Edit the two lists to change the steps offered to learners.
 */
export const NORMAL_RATE = 1
const FAST_RATES = [1.5, 2, 3]
const SLOW_RATES = [0.75, 0.5, 0.25]

// 1x -> 1.5x -> 2x -> 3x -> 1x. From a slowed speed, one press returns to 1x.
export function nextFastRate(current: number) {
  if (current < NORMAL_RATE) return NORMAL_RATE

  return FAST_RATES.find((rate) => rate > current) ?? NORMAL_RATE
}

// 1x -> 0.75x -> 0.5x -> 0.25x -> 1x. From a fast speed, one press returns to 1x.
export function nextSlowRate(current: number) {
  if (current > NORMAL_RATE) return NORMAL_RATE

  return SLOW_RATES.find((rate) => rate < current) ?? NORMAL_RATE
}
