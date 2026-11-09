/**
  File: PlaneIcon.tsx | Author: Chace Nielson
  Date Created: Nov 9, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Render the shared plane navigation icon.

  Usage:
  - Place inside a control with an accessible name supplied by the caller.

  Notes:
  - Decorative SVG semantics are provided by Icon.
 */
import { Icon } from './Icon'

export function PlaneIcon({ className = 'size-6' }: { className?: string }) {
  return (
    <Icon className={className} strokeWidth={1.8}>
      <path d="M12 2c-1 0-1.5 1-1.5 2v4L3 13v2l7.5-2v5L8 20v2l4-1 4 1v-2l-2.5-2v-5l7.5 2v-2l-7.5-5V4c0-1-.5-2-1.5-2Z" />
    </Icon>
  )
}
