/**
  File: MapResetIcon.tsx | Author: Chace Nielson
  Date Created: Nov 6, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Render a reset arrow around a map-center marker.

  Usage:
  - Place inside a map control with an accessible name supplied by the caller.

  Notes:
  - Decorative; the containing control provides its accessible name.
 */
import { Icon } from './Icon'

type MapResetIconProps = {
  className?: string
}

export function MapResetIcon({ className = 'size-6' }: MapResetIconProps) {
  return (
    <Icon className={className}>
      <path d="M4.5 8a8 8 0 1 1-.4 7" />
      <path d="M4 3.5V8h4.5" />
      <circle cx="12" cy="12" r="2.5" />
    </Icon>
  )
}
