/**
  File: HomeIcon.tsx | Author: Chace Nielson
  Date Created: Nov 6, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Render the shared home outline icon.

  Usage:
  - Place inside a navigation link with a visible label.

  Notes:
  - Decorative; the containing link provides its accessible name.
 */
import { Icon } from './Icon'

type HomeIconProps = {
  className?: string
}

export function HomeIcon({ className = 'size-6' }: HomeIconProps) {
  return (
    <Icon className={className}>
      <path d="m3.5 10 8.5-7 8.5 7" />
      <path d="M5.5 9v11h13V9M9.5 20v-6h5v6" />
    </Icon>
  )
}
