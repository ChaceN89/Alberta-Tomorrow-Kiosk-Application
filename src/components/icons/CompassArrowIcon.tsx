/**
  File: CompassArrowIcon.tsx | Author: Chace Nielson
  Date Created: Nov 9, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Draw a faceted, forward-pointing destination compass arrow.

  Usage:
  - Rotated by the flight destination compass.

  Notes:
  - Decorative; the compass supplies localized direction text.
 */
export function CompassArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 64 64" fill="none">
      <path d="M32 3 57 57 32 45 7 57Z" fill="currentColor" />
      <path d="M32 3v42L7 57Z" fill="#000" fillOpacity=".25" />
      <path d="M32 3 57 57 32 45 7 57Z" stroke="currentColor" strokeWidth="2" />
      <path d="M32 3v42" stroke="#fff" strokeOpacity=".6" strokeWidth="2" />
    </svg>
  )
}
