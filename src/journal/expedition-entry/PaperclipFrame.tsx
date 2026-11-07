/**
  File: PaperclipFrame.tsx | Author: Chace Nielson
  Date Created: Nov 6, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Decorate viewable journal media with the shared paperclip motif.

  Usage:
  - Wrap module images and checkpoint image, message, or model controls.

  Notes:
  - The frame adds no border; children control their own presentation.
 */
import type { ReactNode } from 'react'
import { PaperclipIcon } from '@/components/icons/PaperclipIcon'

type PaperclipFrameProps = {
  children: ReactNode
  className?: string
}

export function PaperclipFrame({
  children,
  className = '',
}: PaperclipFrameProps) {
  return (
    <div className={`relative w-fit pt-2 ${className}`}>
      <PaperclipIcon
        className="pointer-events-none absolute -top-1 right-2 z-10 size-7 rotate-12 text-pine"
        hasImage
      />
      {children}
    </div>
  )
}
