/**
  File: repository.ts | Author: Chace Nielson
  Date Created: Nov 9, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Persist base-map discoveries independently of expedition checkpoints.

  Usage:
  - AlbertaDiscoveriesProvider uses the asynchronous browser repository by default.

  Notes:
  - Stable POI IDs and first-visit timestamps are stored in a versioned payload.
 */
export type AlbertaDiscoveryData = Record<string, { firstVisitedAt: string }>

export interface AlbertaDiscoveryRepository {
  load: () => Promise<{
    discoveries: AlbertaDiscoveryData
    isAvailable: boolean
  }>
  save: (discoveries: AlbertaDiscoveryData) => Promise<boolean>
  clear: () => Promise<boolean>
}

const STORAGE_KEY = 'alberta-tomorrow:alberta-discoveries'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export const localStorageAlbertaDiscoveryRepository: AlbertaDiscoveryRepository =
  {
    async load() {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY)
        if (raw === null) return { discoveries: {}, isAvailable: true }
        const parsed: unknown = JSON.parse(raw)
        if (
          !isRecord(parsed) ||
          parsed.version !== 1 ||
          !isRecord(parsed.visitedPois)
        )
          throw new Error('Invalid Alberta discoveries storage format.')
        const entries: [string, { firstVisitedAt: string }][] = []
        for (const [id, value] of Object.entries(parsed.visitedPois)) {
          if (
            !isRecord(value) ||
            typeof value.firstVisitedAt !== 'string' ||
            !Number.isFinite(Date.parse(value.firstVisitedAt))
          )
            throw new Error(`Invalid Alberta discovery timestamp for "${id}".`)
          entries.push([id, { firstVisitedAt: value.firstVisitedAt }])
        }
        return { discoveries: Object.fromEntries(entries), isAvailable: true }
      } catch (error) {
        console.error('Failed to load Alberta discoveries.', error)
        return { discoveries: {}, isAvailable: false }
      }
    },
    async save(discoveries) {
      try {
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ version: 1, visitedPois: discoveries }),
        )
        return true
      } catch (error) {
        console.error('Failed to save Alberta discoveries.', error)
        return false
      }
    },
    async clear() {
      try {
        window.localStorage.removeItem(STORAGE_KEY)
        return true
      } catch (error) {
        console.error('Failed to clear Alberta discoveries.', error)
        return false
      }
    },
  }
