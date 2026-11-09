/**
  File: useFlyoverPoiVisits.ts | Author: Chace Nielson
  Date Created: Nov 9, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Pause at POI cylinder entries and resume when their info panel closes.

  Usage:
  - Used by AlbertaMap with the live flight position and visible POIs.

  Notes:
  - A visit re-arms after one continuous second outside its cylinder.
 */
import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import type { MapPoi } from '../../components/MapPoiMarker'
import type { FlightState, FlyoverPhase } from '../types'
import { FLYOVER_POI_REARM_DELAY_MS } from '../../map-settings/flyoverPoiSettings'
import { getDistanceMeters } from '../utils/flightMath'
import {
  getCylinderEntry,
  getPoiRadiusMeters,
} from '../utils/flightPoiGeometry'

type UseFlyoverPoiVisitsOptions = {
  pois: readonly MapPoi[]
  phase: FlyoverPhase
  isPaused: boolean
  isBlocked: boolean
  isPanelOpen: boolean
  flightPositionRef: RefObject<FlightState | null>
  onEnter: (poi: MapPoi, coordinates: [number, number]) => void
  onResume: (visitedPoiId: string) => void
}

export function useFlyoverPoiVisits(options: UseFlyoverPoiVisitsOptions) {
  const { isPanelOpen, phase, isBlocked, onResume } = options
  const latest = useRef(options)
  const ownedPanel = useRef<{
    poiId: string
    state: 'opening' | 'open'
  } | null>(null)
  useEffect(() => {
    latest.current = options
  })

  useEffect(() => {
    if (isPanelOpen && ownedPanel.current) ownedPanel.current.state = 'open'
    if (!isPanelOpen && ownedPanel.current?.state === 'open') {
      const visitedPoiId = ownedPanel.current.poiId
      ownedPanel.current = null
      if (phase === 'flying' && !isBlocked) onResume(visitedPoiId)
    }
    if (phase === 'exiting' || phase === 'off') ownedPanel.current = null
  }, [isPanelOpen, phase, isBlocked, onResume])

  useEffect(() => {
    let frame = 0
    let previous: [number, number] | null = null
    const visits = new Map<string, number | null>()
    const tick = (now: number) => {
      frame = window.requestAnimationFrame(tick)
      const {
        pois,
        phase,
        isPaused,
        isBlocked,
        isPanelOpen,
        flightPositionRef,
        onEnter,
      } = latest.current
      const flight = flightPositionRef.current
      if (!flight || phase !== 'flying') {
        previous = null
        visits.clear()
        return
      }
      const current: [number, number] = [flight.longitude, flight.latitude]
      const from = previous ?? current
      previous = current
      if (isPaused || isBlocked || isPanelOpen) return
      let candidate: { poi: MapPoi; entry: number } | null = null
      for (const poi of pois) {
        if (!poi.info) continue
        const radius = getPoiRadiusMeters(poi)
        const distance = getDistanceMeters(current, poi.coordinates)
        if (visits.has(poi.id)) {
          if (distance <= radius) {
            visits.set(poi.id, null)
          } else {
            const outsideSince = visits.get(poi.id)
            if (outsideSince === null || outsideSince === undefined)
              visits.set(poi.id, now)
            else if (now - outsideSince >= FLYOVER_POI_REARM_DELAY_MS)
              visits.delete(poi.id)
          }
          continue
        }
        const entry = getCylinderEntry(from, current, poi.coordinates, radius)
        if (entry !== null && (!candidate || entry < candidate.entry))
          candidate = { poi, entry }
      }
      if (!candidate) return
      visits.set(candidate.poi.id, null)
      ownedPanel.current = { poiId: candidate.poi.id, state: 'opening' }
      const coordinates: [number, number] = [
        from[0] + (current[0] - from[0]) * candidate.entry,
        from[1] + (current[1] - from[1]) * candidate.entry,
      ]
      onEnter(candidate.poi, coordinates)
    }
    frame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frame)
  }, [])
}
