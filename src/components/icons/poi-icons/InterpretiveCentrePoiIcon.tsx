/**
  File: InterpretiveCentrePoiIcon.tsx | Author: Chace Nielson
  Date Created: Nov 8, 2026
  Date Updated: Nov 8, 2026

  Description:
  - Represent a visitor or interpretive centre POI.

  Usage:
  - Selected through the shared POI icon category registry.

  Notes:
  - Decorative SVG; the containing POI control provides its accessible name.
 */
import type { PoiIconProps } from './types'

export function InterpretiveCentrePoiIcon({ className }: PoiIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path d="m3 8 9-5 9 5" />
      <path d="M5 9v11h14V9M3 21h18" />
      <circle cx="12" cy="13" r="2.5" />
      <path d="M12 12v2m0-3h.01" />
    </svg>
  )
}
