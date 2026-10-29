/**
  File: HelpIcon.tsx | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Render the shared help icon used by navigation actions.

  Usage:
  - Place inside a button with an accessible label supplied by the caller.

  Notes:
  - None.
 */
import { Icon } from './Icon'

type HelpIconProps = {
  className?: string
}

export function HelpIcon({ className = 'size-6' }: HelpIconProps) {
  return (
    <Icon className={className}>
      <circle cx="12" cy="12" r="11" />
      <path d="M9.6 9a2.4 2.4 0 1 1 3.8 1.9c-.9.7-1.4 1.1-1.4 2.6" />
      <path d="M12 17h.01" />
    </Icon>
  )
}
