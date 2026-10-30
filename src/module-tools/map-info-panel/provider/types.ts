/**
  File: types.ts | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Define safe, React-authored content and options for the map info panel.

  Usage:
  - Used by MapInfoPanelProvider and map-enabled modules.

  Notes:
  - A title is required for every panel.
 */
import type { ReactNode } from 'react'

export type MapInfoPanelOpenOptions = {
  origin?: Element | null
}

export type MapInfoPanelCloseOptions = {
  restoreFocus?: boolean
}

export type MapInfoPanelContent = {
  title: string
  content: ReactNode
}
