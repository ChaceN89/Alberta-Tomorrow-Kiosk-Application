/**
  File: ResidentialSchoolsModuleIcon.tsx | Author: Chace Nielson
  Date Created: Nov 6, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Draw an open archival book for the residential-schools expedition card.

  Usage:
  - Registered in the residential-schools module settings.

  Notes:
  - The icon represents historical records and learning.
 */
import { Icon } from '../Icon'
import type { ModuleIconProps } from './types'

export function ResidentialSchoolsModuleIcon({
  className = '',
}: ModuleIconProps) {
  return (
    <Icon className={className} strokeWidth={1.8}>
      <path d="M12 7.2c-2.2-2-5.2-2.5-8-1.8v12c2.8-.7 5.8-.2 8 1.8 2.2-2 5.2-2.5 8-1.8v-12c-2.8-.7-5.8-.2-8 1.8Z" />
      <path d="M12 7.2v12M6.5 9.5c1.3-.1 2.6.1 3.7.7m-3.7 2c1.3-.1 2.6.1 3.7.7m7.3-3.4c-1.3-.1-2.6.1-3.7.7m3.7 2c-1.3-.1-2.6.1-3.7.7" />
    </Icon>
  )
}
