/**
  File: FoxesModuleIcon.tsx | Author: Chace Nielson
  Date Created: Nov 6, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Render the supplied fox silhouette for the Alberta foxes expedition.

  Usage:
  - Registered in the foxes module settings.

  Notes:
  - A CSS mask lets the global SVG asset inherit the surrounding icon color.
 */
import foxVixenSvg from '@/assets/fox-icon.svg?url'
import type { ModuleIconProps } from './types'

export function FoxesModuleIcon({ className = '' }: ModuleIconProps) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block ${className}`}
      style={{
        backgroundColor: 'currentColor',
        mask: `url("${foxVixenSvg}") center / contain no-repeat`,
        WebkitMask: `url("${foxVixenSvg}") center / contain no-repeat`,
      }}
    />
  )
}
