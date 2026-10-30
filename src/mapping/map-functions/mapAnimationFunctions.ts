/**
  File: mapAnimationFunctions.ts | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Respect reduced-motion preferences when animating map movement.

  Usage:
  - Imported by useAlbertaMapController.

  Notes:
  - Map movement durations are supplied by map settings or controls.
 */
// Function: Disable map animation when the user requests reduced motion.
export function getAnimationDuration(duration: number) {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ? 0
    : duration
}
