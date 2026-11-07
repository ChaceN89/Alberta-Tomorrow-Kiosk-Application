/**
  File: ActivityIcon.tsx | Author: Chace Nielson
  Date Created: Nov 6, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Show a page with a return arrow for navigating back to an activity.

  Usage:
  - Used by the module map activity navigation control.

  Notes:
  - The containing control provides the accessible name.
 */
import { Icon } from './Icon'

type ActivityIconProps = {
  className: string
}

export function ActivityIcon({ className }: ActivityIconProps) {
  return (
    <Icon className={className}>
      <path d="M15 3.5H6A2.5 2.5 0 0 0 3.5 6v12A2.5 2.5 0 0 0 6 20.5h8" />
      <path d="M14.5 3.5v4H19" />
      <path d="M7.5 10h7M7.5 13.5h4" />
      <path d="M21 18.5h-5m2.5-2.5-2.5 2.5 2.5 2.5" />
    </Icon>
  )
}
