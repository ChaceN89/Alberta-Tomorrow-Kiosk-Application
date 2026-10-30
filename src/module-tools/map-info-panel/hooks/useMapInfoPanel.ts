/**
  File: useMapInfoPanel.ts | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Provide the map info panel open action to map-enabled modules.

  Usage:
  - Call useMapInfoPanel from a descendant of MapInfoPanelProvider.

  Notes:
  - The provider owns panel state and rendering.
 */
import { useContext } from 'react'
import { MapInfoPanelContext } from '../provider/MapInfoPanelContext'

export function useMapInfoPanel() {
  const context = useContext(MapInfoPanelContext)
  if (!context) {
    throw new Error('Map info panel must be used inside its provider.')
  }

  return context
}
