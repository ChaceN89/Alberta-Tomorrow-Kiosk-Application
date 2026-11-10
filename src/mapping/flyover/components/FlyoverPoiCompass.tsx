/**
  File: FlyoverPoiCompass.tsx | Author: Chace Nielson
  Date Created: Nov 9, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Point toward the selected POI relative to the aircraft's heading.

  Usage:
  - Rendered by PlaneHud during flight with a visible destination.

  Notes:
  - Reads physical flight state, so freelook does not change steering guidance.
  - The SVG overview stays north-up and needs no second map renderer or tiles.
 */
import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { useTranslation } from 'react-i18next'
import { CompassArrowIcon } from '@/components/icons/CompassArrowIcon'
import { FLYOVER_POI_COLORS } from '../../map-settings/flyoverPoiSettings'
import type { MapPoi } from '../../components/MapPoiMarker'
import type { FlightState } from '../types'
import {
  getBearingDegrees,
  getDistanceMeters,
  shortestAngleDelta,
} from '../utils/flightMath'
import {
  FLIGHT_MINI_MAP_PATH,
  projectFlightMiniMap,
} from '../utils/flightMiniMap'

type FlyoverPoiCompassProps = {
  poi: MapPoi
  isVisible: boolean
  flightPositionRef: RefObject<FlightState | null>
}

export function FlyoverPoiCompass({
  poi,
  isVisible,
  flightPositionRef,
}: FlyoverPoiCompassProps) {
  const { t, i18n } = useTranslation('mapping')
  const arrowRef = useRef<HTMLDivElement>(null)
  const positionRef = useRef<SVGGElement>(null)
  const headingRef = useRef<SVGGElement>(null)
  const [reading, setReading] = useState<{
    distance: number
    direction: 'ahead' | 'left' | 'right' | 'behind'
  } | null>(null)
  const [longitude, latitude] = poi.coordinates

  useEffect(() => {
    if (!isVisible) return
    let frame = 0
    let lastFrameAt = performance.now()
    let lastPublishAt = -Infinity
    let angle: number | null = null
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const tick = (now: number) => {
      frame = requestAnimationFrame(tick)
      const flight = flightPositionRef.current
      const seconds = Math.min((now - lastFrameAt) / 1000, 0.1)
      lastFrameAt = now
      if (!flight) return
      const position: [number, number] = [flight.longitude, flight.latitude]
      const destination: [number, number] = [longitude, latitude]
      const point = projectFlightMiniMap(flight.longitude, flight.latitude)
      positionRef.current?.setAttribute(
        'transform',
        `translate(${Math.max(4, Math.min(92, point.x))} ${Math.max(4, Math.min(156, point.y))})`,
      )
      headingRef.current?.setAttribute(
        'transform',
        `rotate(${flight.headingDegrees})`,
      )
      const distance = getDistanceMeters(position, destination)
      const target =
        distance < 1
          ? 0
          : shortestAngleDelta(
              flight.headingDegrees,
              getBearingDegrees(position, destination),
            )
      angle =
        angle === null || reducedMotion.matches
          ? target
          : angle +
            shortestAngleDelta(angle, target) * (1 - Math.exp(-10 * seconds))
      arrowRef.current?.style.setProperty('--compass-bearing', `${angle}deg`)
      if (now - lastPublishAt < 100) return
      lastPublishAt = now
      setReading({
        distance,
        direction:
          Math.abs(target) >= 160
            ? 'behind'
            : Math.abs(target) <= 10
              ? 'ahead'
              : target < 0
                ? 'left'
                : 'right',
      })
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [flightPositionRef, isVisible, longitude, latitude])

  return (
    <section
      className={`plane-hud__compass ${isVisible ? 'plane-hud__compass--visible' : ''}`}
      aria-hidden={!isVisible}
      aria-label={t('flyover.compass.label', { name: poi.title })}
      aria-live="off"
    >
      <svg
        className="plane-hud__mini-map"
        viewBox="0 0 96 160"
        role="img"
        aria-label={t('flyover.compass.miniMapLabel')}
      >
        <path
          className="plane-hud__mini-map-outline"
          d={FLIGHT_MINI_MAP_PATH}
        />
        <g ref={positionRef} visibility={reading ? 'visible' : 'hidden'}>
          <g ref={headingRef} className="plane-hud__mini-map-heading">
            <path d="M0 -12 6 -2 0 -4 -6 -2Z" />
          </g>
          <circle className="plane-hud__mini-map-position" r="5" />
        </g>
      </svg>
      <div className="plane-hud__compass-details">
        <strong className="plane-hud__compass-title" title={poi.title}>
          {poi.title}
        </strong>
        {reading && (
          <p className="plane-hud__compass-reading">
            <span>{t(`flyover.compass.${reading.direction}`)}</span>
            <span>
              {new Intl.NumberFormat(i18n.resolvedLanguage, {
                style: 'unit',
                unit: reading.distance >= 1000 ? 'kilometer' : 'meter',
                maximumFractionDigits: reading.distance >= 1000 ? 1 : 0,
              }).format(
                reading.distance >= 1000
                  ? reading.distance / 1000
                  : reading.distance,
              )}
            </span>
          </p>
        )}
        <div className="plane-hud__compass-dial" aria-hidden="true">
          <div
            ref={arrowRef}
            className="plane-hud__compass-arrow"
            style={{ color: FLYOVER_POI_COLORS.active }}
          >
            <CompassArrowIcon />
          </div>
        </div>
      </div>
    </section>
  )
}
