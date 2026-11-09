/**
  File: useMapAttributionCollapse.ts | Author: Chace Nielson
  Date Created: Nov 8, 2026
  Date Updated: Nov 8, 2026

  Description:
  - Collapse MapLibre's compact attribution after its credits have been visible.

  Usage:
  - Used by AlbertaMap after the MapLibre instance is ready.

  Notes:
  - The delay preserves a brief opportunity to read the attribution.
 */
import { useEffect } from 'react'
import type { Map as MapLibreMap } from 'maplibre-gl'

export function useMapAttributionCollapse(mapInstance: MapLibreMap | null) {
  useEffect(() => {
    if (!mapInstance) return

    const timer = window.setTimeout(() => {
      const attribution = mapInstance
        .getContainer()
        .querySelector<HTMLElement>(
          '.maplibregl-ctrl-top-right .maplibregl-ctrl-attrib',
        )
      if (!attribution?.classList.contains('maplibregl-compact-show')) return

      attribution
        .querySelector<HTMLElement>('.maplibregl-ctrl-attrib-button')
        ?.click()
    }, 1000)

    return () => window.clearTimeout(timer)
  }, [mapInstance])
}
