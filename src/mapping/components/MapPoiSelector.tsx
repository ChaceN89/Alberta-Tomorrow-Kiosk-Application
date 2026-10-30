/**
  File: MapPoiSelector.tsx | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Select a visible point of interest or cycle to an adjacent location.

  Usage:
  - Rendered at the bottom center of AlbertaMap.

  Notes:
  - The parent supplies the POI list for the current map and layer settings.
 */
import { useEffect, useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { MapPoi } from './MapPoiMarker'

type MapPoiSelectorProps = {
  pois: readonly MapPoi[]
  activePoiId: string | null
  onSelect: (poi: MapPoi) => void
}

type PoiArrowProps = {
  direction: 'previous' | 'next'
}

function PoiArrow({ direction }: PoiArrowProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mapping-poi-selector__arrow"
    >
      <path d={direction === 'previous' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'} />
    </svg>
  )
}

export function MapPoiSelector({
  pois,
  activePoiId,
  onSelect,
}: MapPoiSelectorProps) {
  const { t } = useTranslation('mapping')
  const [isListOpen, setIsListOpen] = useState(false)
  const listId = useId()
  const rootRef = useRef<HTMLElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const activeIndex = pois.findIndex((poi) => poi.id === activePoiId)
  const currentIndex = activeIndex < 0 ? 0 : activeIndex
  const activePoi = pois[currentIndex]

  useEffect(() => {
    if (!isListOpen) return

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !rootRef.current?.contains(event.target)
      ) {
        setIsListOpen(false)
      }
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return

      setIsListOpen(false)
      triggerRef.current?.focus()
    }

    document.addEventListener('pointerdown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [isListOpen])

  if (!activePoi) return null

  const selectOffset = (offset: number) => {
    const nextIndex = (currentIndex + offset + pois.length) % pois.length
    onSelect(pois[nextIndex])
  }

  return (
    <nav
      ref={rootRef}
      className="mapping-poi-selector"
      aria-label={t('poiCycle.label')}
    >
      <button
        type="button"
        className="mapping-poi-selector__button"
        aria-label={t('poiCycle.previous', { name: activePoi.title })}
        onClick={() => selectOffset(-1)}
      >
        <PoiArrow direction="previous" />
      </button>
      <button
        type="button"
        className="mapping-poi-selector__button"
        aria-label={t('poiCycle.goToActive', { name: activePoi.title })}
        onClick={() => {
          onSelect(activePoi)
          setIsListOpen(false)
        }}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mapping-poi-selector__locate-icon"
        >
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="2" />
          <path d="M12 2v2m0 16v2M2 12h2m16 0h2" />
        </svg>
      </button>
      <button
        ref={triggerRef}
        type="button"
        className="mapping-poi-selector__active"
        aria-label={t('poiCycle.select', { name: activePoi.title })}
        aria-expanded={isListOpen}
        aria-controls={listId}
        onClick={() => setIsListOpen((open) => !open)}
      >
        <span className="mapping-poi-selector__active-title">
          {activePoi.title}
        </span>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="mapping-poi-selector__chevron"
        >
          <path d="m5 7.5 5 5 5-5" />
        </svg>
      </button>
      <button
        type="button"
        className="mapping-poi-selector__button"
        aria-label={t('poiCycle.next', { name: activePoi.title })}
        onClick={() => selectOffset(1)}
      >
        <PoiArrow direction="next" />
      </button>
      {isListOpen && (
        <ul
          id={listId}
          className="mapping-poi-selector__list"
          aria-label={t('poiCycle.listLabel')}
        >
          {pois.map((poi) => (
            <li key={poi.id}>
              <button
                type="button"
                className="mapping-poi-selector__option"
                aria-pressed={poi.id === activePoi.id}
                onClick={() => {
                  onSelect(poi)
                  setIsListOpen(false)
                  triggerRef.current?.focus()
                }}
              >
                <span className="mapping-poi-selector__option-title">
                  {poi.title}
                </span>
                {poi.id === activePoi.id && (
                  <span aria-hidden="true" className="text-pine">
                    ✓
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </nav>
  )
}
