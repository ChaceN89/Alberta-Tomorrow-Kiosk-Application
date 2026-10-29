/**
  File: JournalIcon.tsx | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Render the shared journal book icon used by navigation and journal actions.

  Usage:
  - Place inside a button with an accessible label supplied by the caller.

  Notes:
  - None.
 */
import { Icon } from './Icon'

type JournalIconProps = {
  className?: string
}

export function JournalIcon({ className = 'size-5' }: JournalIconProps) {
  return (
    <Icon className={className}>
      <path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3Z" />
      <path d="M5 17a3 3 0 0 1 3-3h11M10 8h5" />
    </Icon>
  )
}
