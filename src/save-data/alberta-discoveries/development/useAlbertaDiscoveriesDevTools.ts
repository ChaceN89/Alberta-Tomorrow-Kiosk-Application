/**
  File: useAlbertaDiscoveriesDevTools.ts | Author: Chace Nielson
  Date Created: Nov 9, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Expose discovery reset only to developer tools.

  Usage:
  - Whole-site reset clears discoveries without coupling them to expedition resets.

  Notes:
  - The provider drains queued saves before removing persisted discoveries.
 */
import { createContext, useContext } from 'react'

export const AlbertaDiscoveriesDevToolsContext = createContext<{
  resetDiscoveries: () => Promise<boolean>
} | null>(null)

export function useAlbertaDiscoveriesDevTools() {
  const context = useContext(AlbertaDiscoveriesDevToolsContext)
  if (!context)
    throw new Error(
      'Discovery developer tools require AlbertaDiscoveriesProvider.',
    )
  return context
}
