/**
  File: OverviewIcon.tsx | Author: Chace Nielson
  Date Created: Nov 6, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Render a document outline for expedition overview navigation.

  Usage:
  - Place inside a navigation link with a visible label.

  Notes:
  - Decorative; the containing link provides its accessible name.
 */
import { Icon } from './Icon'

type OverviewIconProps = {
  className?: string
}

export function OverviewIcon({ className = 'size-6' }: OverviewIconProps) {
  return (
    <Icon className={className}>
      <path d="M6 3.5h8.5l4 4v13H6A2.5 2.5 0 0 1 3.5 18V6A2.5 2.5 0 0 1 6 3.5Z" />
      <path d="M14.5 3.5v4h4M8 11h6.5M8 14.5h6.5" />
    </Icon>
  )
}
