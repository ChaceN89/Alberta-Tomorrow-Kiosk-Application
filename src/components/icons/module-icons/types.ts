/**
  File: types.ts | Author: Chace Nielson
  Date Created: Nov 6, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Define the shared props and component type for module-card icons.

  Usage:
  - Module icon components and module settings use these types.

  Notes:
  - Icons are decorative because each module card already has a visible title.
 */
import type { ComponentType } from 'react'

export type ModuleIconProps = {
  className?: string
}

export type ModuleIconComponent = ComponentType<ModuleIconProps>
