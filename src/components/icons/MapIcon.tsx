/**
  File: MapIcon.tsx | Author: Chace Nielson
  Date Created: Nov 5, 2026
  Date Updated: Nov 5, 2026

  Description:
  - Render the shared folded map icon.

  Usage:
  - Place inside a control with an accessible name supplied by the caller.

  Notes:
  - None.
 */
import { Icon } from './Icon'

type MapIconProps = {
  className?: string
}

export function MapIcon({ className = 'size-6' }: MapIconProps) {
  return (
    <Icon className={className} strokeWidth={1.8} strokeLinecap="butt">
      <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3z" />
      <path d="M9 3v15m6-12v15" />
    </Icon>
  )
}
