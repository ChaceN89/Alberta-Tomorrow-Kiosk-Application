/**
  File: FrankSlideModuleIcon.tsx | Author: Chace Nielson
  Date Created: Nov 6, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Draw a mountainside and falling rocks for the Frank Slide expedition card.

  Usage:
  - Registered in the Frank Slide module settings.

  Notes:
  - The icon is decorative and uses the shared current-color SVG style.
 */
import { Icon } from '../Icon'
import type { ModuleIconProps } from './types'

export function FrankSlideModuleIcon({ className = '' }: ModuleIconProps) {
  return (
    <Icon className={className} strokeWidth={1.8}>
      <path d="m2.8 19.5 7.3-12 3.2 5.3 3.8-7 4.1 13.7z" />
      <path d="m8.6 9.9 2.2 1.4 1.8-1.1 1.8 1.3m-8.8 5.3 2.1-.7 2.2.9 2.2-.8 2.1.7 2-.8" />
      <path d="m17.5 3.3 1.4 1.4m1.6.5 1.1 1.1m-4.9 1.1 1.1 1.1" />
    </Icon>
  )
}
