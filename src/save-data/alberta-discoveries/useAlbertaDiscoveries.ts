/**
  File: useAlbertaDiscoveries.ts | Author: Chace Nielson
  Date Created: Nov 9, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Expose saved Alberta discoveries and the idempotent visit action.

  Usage:
  - Consumed by maps and the journal inside AlbertaDiscoveriesProvider.

  Notes:
  - Discovery IDs belong to the base POI list, not the module registry.
 */
import { createContext, useContext } from 'react'
import type { BasePoiId } from '@/mapping/POIs/BasePOIList'
import type { AlbertaDiscoveryData } from './repository'

export type AlbertaDiscoveriesContextValue = {
  discoveries: AlbertaDiscoveryData
  isStorageAvailable: boolean
  recordVisit: (poiId: BasePoiId) => void
}

export const AlbertaDiscoveriesContext =
  createContext<AlbertaDiscoveriesContextValue | null>(null)

export function useAlbertaDiscoveries() {
  const value = useContext(AlbertaDiscoveriesContext)
  if (!value)
    throw new Error('Alberta discoveries require AlbertaDiscoveriesProvider.')
  return value
}
