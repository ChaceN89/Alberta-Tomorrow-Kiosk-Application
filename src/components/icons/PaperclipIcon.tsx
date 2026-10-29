/**
  File: PaperclipIcon.tsx | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Provide a reusable decorative paperclip icon.

  Usage:
  - The containing interface provides the icon's accessible context.

  Notes:
  - A small gap in the inner wire lets an attached image appear to overlap it.
 */
import { Icon } from './Icon'

type PaperclipIconProps = {
  className: string
  hasImage?: boolean
}

export function PaperclipIcon({
  className,
  hasImage = false,
}: PaperclipIconProps) {
  return (
    <Icon className={className}>
      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83" />
      {hasImage ? (
        <>
          <path d="m6.58 14.58 2.4-2.4" />
          <path d="m11.8 9.36 3.27-3.26" />
        </>
      ) : (
        <path d="m6.58 14.58 8.49-8.48" />
      )}
    </Icon>
  )
}
