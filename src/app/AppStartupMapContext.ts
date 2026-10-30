/**
  File: AppStartupMapContext.ts | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Coordinate map readiness with the initial application splash screen.

  Usage:
  - AppStartup provides the context; map routes register their startup dependency
    and the map reports when it is ready or has failed.

  Notes:
  - Non-map routes do not need to register a startup dependency.
 */
import { createContext, useContext } from 'react'

type AppStartupMapGate = {
  setMapRequired: (isRequired: boolean) => void
  markMapReady: () => void
}

export const AppStartupMapContext = createContext<AppStartupMapGate | null>(
  null,
)

export function useAppStartupMapGate() {
  return useContext(AppStartupMapContext)
}
