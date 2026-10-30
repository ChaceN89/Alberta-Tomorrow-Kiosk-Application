/**
  File: MapInfoPanelContext.ts | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Share map info panel state and actions with map markers.

  Usage:
  - Imported by MapInfoPanelProvider and useMapInfoPanel.

  Notes:
  - Consumers should use the useMapInfoPanel hook.
 */
import { createContext } from 'react'
import type {
  MapInfoPanelCloseOptions,
  MapInfoPanelContent,
  MapInfoPanelOpenOptions,
} from './types'

export type MapInfoPanelContextValue = {
  openPanel: (
    content: MapInfoPanelContent,
    options?: MapInfoPanelOpenOptions,
  ) => void
  closePanel: (options?: MapInfoPanelCloseOptions) => void
}

export const MapInfoPanelContext =
  createContext<MapInfoPanelContextValue | null>(null)
