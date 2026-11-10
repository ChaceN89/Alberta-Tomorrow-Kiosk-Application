/**
  File: AlbertaDiscoveriesProvider.tsx | Author: Chace Nielson
  Date Created: Nov 9, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Hydrate and serialize independent Alberta POI discovery progress.

  Usage:
  - Wrap journal and map consumers; accepts a repository for storage adapters.

  Notes:
  - Repeated visits preserve the first date; queued writes cannot overtake each other.
 */
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { BasePoiId } from '@/mapping/POIs/BasePOIList'
import {
  localStorageAlbertaDiscoveryRepository,
  type AlbertaDiscoveryData,
  type AlbertaDiscoveryRepository,
} from './repository'
import { AlbertaDiscoveriesContext } from './useAlbertaDiscoveries'
import { AlbertaDiscoveriesDevToolsContext } from './development/useAlbertaDiscoveriesDevTools'

export function AlbertaDiscoveriesProvider({
  children,
  fallback = null,
  repository = localStorageAlbertaDiscoveryRepository,
}: {
  children: ReactNode
  fallback?: ReactNode
  repository?: AlbertaDiscoveryRepository
}) {
  const [discoveries, setDiscoveries] = useState<AlbertaDiscoveryData>({})
  const [isStorageAvailable, setIsStorageAvailable] = useState(true)
  const [loadedRepository, setLoadedRepository] =
    useState<AlbertaDiscoveryRepository | null>(null)
  const snapshot = useRef<AlbertaDiscoveryData>({})
  const writes = useRef(Promise.resolve())
  const sequence = useRef(0)

  useEffect(() => {
    let current = true
    sequence.current++
    void repository
      .load()
      .then((result) => {
        if (!current) return
        snapshot.current = result.discoveries
        setDiscoveries(result.discoveries)
        setIsStorageAvailable(result.isAvailable)
        setLoadedRepository(repository)
      })
      .catch((error: unknown) => {
        console.error('Failed to initialize Alberta discoveries.', error)
        if (!current) return
        snapshot.current = {}
        setDiscoveries({})
        setIsStorageAvailable(false)
        setLoadedRepository(repository)
      })
    return () => {
      current = false
    }
  }, [repository])

  const recordVisit = useCallback(
    (poiId: BasePoiId) => {
      if (Object.hasOwn(snapshot.current, poiId)) return
      const next = {
        ...snapshot.current,
        [poiId]: { firstVisitedAt: new Date().toISOString() },
      }
      snapshot.current = next
      setDiscoveries(next)
      const writeSequence = ++sequence.current
      const write = writes.current.then(() => repository.save(next))
      writes.current = write.then(
        () => undefined,
        () => undefined,
      )
      void write
        .then((available) => {
          if (sequence.current === writeSequence)
            setIsStorageAvailable(available)
        })
        .catch((error: unknown) => {
          console.error('Failed to persist Alberta discoveries.', error)
          if (sequence.current === writeSequence) setIsStorageAvailable(false)
        })
    },
    [repository],
  )

  const value = useMemo(
    () => ({
      discoveries,
      isStorageAvailable,
      recordVisit,
    }),
    [discoveries, isStorageAvailable, recordVisit],
  )
  const resetDiscoveries = useCallback(async () => {
    try {
      await writes.current
      const available = await repository.clear()
      sequence.current++
      if (available) {
        snapshot.current = {}
        setDiscoveries({})
      }
      setIsStorageAvailable(available)
      return available
    } catch (error) {
      console.error('Failed to reset Alberta discoveries.', error)
      setIsStorageAvailable(false)
      return false
    }
  }, [repository])
  const devTools = useMemo(() => ({ resetDiscoveries }), [resetDiscoveries])

  return (
    <AlbertaDiscoveriesContext.Provider value={value}>
      <AlbertaDiscoveriesDevToolsContext.Provider value={devTools}>
        {loadedRepository === repository ? children : fallback}
      </AlbertaDiscoveriesDevToolsContext.Provider>
    </AlbertaDiscoveriesContext.Provider>
  )
}
