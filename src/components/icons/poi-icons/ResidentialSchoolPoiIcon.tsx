/**
  File: ResidentialSchoolPoiIcon.tsx | Author: Chace Nielson
  Date Created: Nov 8, 2026
  Date Updated: Nov 8, 2026

  Description:
  - Represent a residential-school POI with a restrained institutional icon.

  Usage:
  - Selected through the shared POI icon category registry.

  Notes:
  - Decorative SVG; the containing POI control provides its accessible name.
 */
import type { PoiIconProps } from './types'

export function ResidentialSchoolPoiIcon({ className }: PoiIconProps) {
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
      <path d="M9 20v-6h6v6M7.5 12h1m7 0h1" />
    </svg>
  )
}
