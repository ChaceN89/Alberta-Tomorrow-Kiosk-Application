/**
  File: CommunityPoiIcon.tsx | Author: Chace Nielson
  Date Created: Nov 8, 2026
  Date Updated: Nov 8, 2026

  Description:
  - Represent a city, town, or other community POI.

  Usage:
  - Selected through the shared POI icon category registry.

  Notes:
  - Decorative SVG; the containing POI control provides its accessible name.
 */
import type { PoiIconProps } from './types'

export function CommunityPoiIcon({ className }: PoiIconProps) {
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
      <path d="M3 20.5h18" />
      <path d="M4.5 20.5V10l5.5-2.5v13" />
      <path d="M10 20.5V4.5l9.5 3.5v12.5" />
      <path d="M7 11v1m0 2v1m6-7v1m3-1v1m-3 2v1m3-1v1m-3 2v1m3-1v1" />
    </svg>
  )
}
