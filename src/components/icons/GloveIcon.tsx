/**
  File: GloveIcon.tsx | Author: Chace Nielson
  Date Created: Nov 9, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Render a grabbing glove for pointer drag controls.

  Usage:
  - Decorative icon; the caller provides its accessible label.

  Notes:
  - Uses the shared Icon wrapper.
 */
import { Icon } from './Icon'

export function GloveIcon({ className = 'size-6' }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M8 13V5a1.5 1.5 0 0 1 3 0v6-7a1.5 1.5 0 0 1 3 0v7-5a1.5 1.5 0 0 1 3 0v6-3a1.5 1.5 0 0 1 3 0v7c0 3-2 5-5 5h-3c-2 0-3-1-4-3l-4-5a1.5 1.5 0 0 1 2-2Z" />
    </Icon>
  )
}
