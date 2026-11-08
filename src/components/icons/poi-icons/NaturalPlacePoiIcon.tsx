/**
  File: NaturalPlacePoiIcon.tsx | Author: Chace Nielson
  Date Created: Nov 8, 2026
  Date Updated: Nov 8, 2026

  Description:
  - Represent a natural area, park, or landform POI.

  Usage:
  - Selected through the shared POI icon category registry.

  Notes:
  - Decorative SVG; the containing POI control provides its accessible name.
 */
import type { PoiIconProps } from './types'

export function NaturalPlacePoiIcon({ className }: PoiIconProps) {
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
      <circle cx="18" cy="6" r="2" />
      <path d="m2.5 20 7-11 4.3 6 3.1-4L21.5 20z" />
      <path d="M5 17h3m8-1h2" />
    </svg>
  )
}
