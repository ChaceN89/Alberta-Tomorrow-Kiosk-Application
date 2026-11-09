/**
  File: FreeLookIcon.tsx | Author: Chace Nielson
  Date Created: Nov 9, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Render four directional arrows for free-look camera movement.

  Usage:
  - Pair with a translated label; Icon provides decorative SVG semantics.

  Notes:
  - Uses the shared Icon wrapper.
 */
import { Icon } from './Icon'

export function FreeLookIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M12 3v18M3 12h18M8 7l4-4 4 4M8 17l4 4 4-4M7 8l-4 4 4 4M17 8l4 4-4 4" />
    </Icon>
  )
}
