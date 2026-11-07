/**
  File: GeologyModuleIcon.tsx | Author: Chace Nielson
  Date Created: Nov 6, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Draw layered Alberta landforms for the geology expedition card.

  Usage:
  - Registered in the geology module settings.

  Notes:
  - The icon is decorative and uses the shared current-color SVG style.
 */
import { Icon } from '../Icon'
import type { ModuleIconProps } from './types'

export function GeologyModuleIcon({ className = '' }: ModuleIconProps) {
  return (
    <Icon className={className} strokeWidth={1.8}>
      <path d="m2.8 19.5 6.1-10 3.2 4.4 3.7-7.1 5.4 12.7z" />
      <path d="m5.4 15.2 2.2 1.1 2.3-.7 2.4 1.1 2.4-1.3 2.4.8 2.4-1.1" />
    </Icon>
  )
}
