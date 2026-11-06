/**
  File: MusicNoteIcon.tsx | Author: Chace Nielson
  Date Created: Nov 6, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Render the shared music note icon used for audio media.

  Usage:
  - Place inside a button or media label with an accessible name supplied by the caller.

  Notes:
  - Decorative icon; hidden from assistive technology by the shared SVG wrapper.
 */
import { Icon } from './Icon'

type MusicNoteIconProps = {
  className?: string
}

export function MusicNoteIcon({ className = 'size-5' }: MusicNoteIconProps) {
  return (
    <Icon className={className}>
      <path
        d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3z"
        fill="currentColor"
        stroke="none"
      />
    </Icon>
  )
}
