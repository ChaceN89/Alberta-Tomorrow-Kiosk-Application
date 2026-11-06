/**
  File: VideoIcon.tsx | Author: Chace Nielson
  Date Created: Nov 6, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Render the shared video camera icon used for video media.

  Usage:
  - Place inside a button or media label with an accessible name supplied by the caller.

  Notes:
  - Decorative icon; hidden from assistive technology by the shared SVG wrapper.
 */
import { Icon } from './Icon'

type VideoIconProps = {
  className?: string
}

export function VideoIcon({ className = 'size-5' }: VideoIconProps) {
  return (
    <Icon className={className}>
      <rect x="3" y="6" width="12" height="12" rx="2" />
      <path d="m15 10 6-4v12l-6-4" />
    </Icon>
  )
}
