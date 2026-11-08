/**
  File: IndigenousHeritagePoiIcon.tsx | Author: Chace Nielson
  Date Created: Nov 8, 2026
  Date Updated: Nov 8, 2026

  Description:
  - Represent an Indigenous cultural heritage site POI.

  Usage:
  - Selected through the shared POI icon category registry.

  Notes:
  - Uses a neutral etched-stone motif rather than a Nation-specific symbol.
 */
import type { PoiIconProps } from './types'

export function IndigenousHeritagePoiIcon({ className }: PoiIconProps) {
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
      <path d="M5 3.5 19 5v14l-14 1.5z" />
      <path d="M8 9c1.3-1.6 2.7-1.6 4 0s2.7 1.6 4 0" />
      <path d="M8 14h8m-4-2v4" />
    </svg>
  )
}
