/**
  File: HistoricSitePoiIcon.tsx | Author: Chace Nielson
  Date Created: Nov 8, 2026
  Date Updated: Nov 8, 2026

  Description:
  - Represent a historic or heritage site POI.

  Usage:
  - Selected through the shared POI icon category registry.

  Notes:
  - Decorative SVG; the containing POI control provides its accessible name.
 */
import type { PoiIconProps } from './types'

export function HistoricSitePoiIcon({ className }: PoiIconProps) {
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
      <path d="m3 8.5 9-5 9 5" />
      <path d="M4 10h16M5 20h14M3 22h18" />
      <path d="M7 10v10m5-10v10m5-10v10" />
    </svg>
  )
}
