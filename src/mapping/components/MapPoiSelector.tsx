/**
  File: MapPoiSelector.tsx | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Select a visible point of interest or cycle to an adjacent location.

  Usage:
  - Fixed in the bottom-right corner of the screen.

  Notes:
  - The parent supplies the POI list for the current map and layer settings.
  - Selection never navigates; only the locate button invokes navigation.
 */
import { useEffect, useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { POI_CATEGORY_ICONS } from '@/components/icons/poi-icons'
import { Tooltip } from '@/components/shared/Tooltip'
import type { MapPoi } from './MapPoiMarker'
import { isFlightShortcutIgnored } from '../flyover/utils/flightKeyboard'

type MapPoiSelectorProps = {
  isInteractive: boolean
  pois: readonly MapPoi[]
  activePoiId: string | null
  onSelect: (poi: MapPoi) => void
  onLocate: (poi: MapPoi) => void
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
  isInteractive,
  pois: availablePois,
  activePoiId,
  onSelect,
  onLocate,
}: MapPoiSelectorProps) {
  const { t } = useTranslation('mapping')
  const [isListOpen, setIsListOpen] = useState(false)
  const listId = useId()
  const rootRef = useRef<HTMLElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const groups = [
    {
      id: 'alberta',
      title: t('poiCycle.albertaPoints'),
      pois: availablePois.filter(
        (poi) => !poi.isModuleEntry && !poi.isModulePoi,
      ),
    },
    {
      id: 'module',
      title: t('view.expeditionPoisLabel'),
      pois: availablePois.filter(
        (poi) => poi.isModulePoi && !poi.isModuleEntry,
      ),
    },
    {
      id: 'expeditions',
      title: t('navigation.expeditions'),
      pois: [
        ...availablePois.filter(
          (poi) => poi.isModuleEntry && !poi.concealedTitle,
        ),
        ...availablePois.filter(
          (poi) => poi.isModuleEntry && poi.concealedTitle,
        ),
      ],
    },
  ].filter((group) => group.pois.length > 0)
  const pois = groups.flatMap((group) => group.pois)
  const activeIndex = pois.findIndex((poi) => poi.id === activePoiId)
  const currentIndex = activeIndex < 0 ? 0 : activeIndex
  const activePoi = pois[currentIndex]
  const ActivePoiIcon = activePoi
    ? (activePoi.icon ?? POI_CATEGORY_ICONS[activePoi.iconCategory])
    : null
  const activePoiCategory = activePoi
    ? activePoi.isModuleEntry
      ? t('moduleEntry.category')
      : t(`poiCategories.${activePoi.iconCategory}`)
    : ''

  useEffect(() => {
    if (!isInteractive) return
    const cycleTarget = (event: KeyboardEvent) => {
      if (
        (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') ||
        event.defaultPrevented ||
        event.shiftKey ||
        isFlightShortcutIgnored(event) ||
        pois.length === 0 ||
        (event.target instanceof Element &&
          event.target.closest(
            'input, [role="slider"], [role="menu"], [role="listbox"], [role="tablist"]',
          ))
      )
        return

      event.preventDefault()
      event.stopImmediatePropagation()
      if (event.repeat) return
      const offset = event.key === 'ArrowLeft' ? -1 : 1
      onSelect(pois[(currentIndex + offset + pois.length) % pois.length])
    }

    window.addEventListener('keydown', cycleTarget, true)
    return () => window.removeEventListener('keydown', cycleTarget, true)
  }, [currentIndex, isInteractive, onSelect, pois])

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
      aria-keyshortcuts="ArrowLeft ArrowRight"
    >
      <button
        type="button"
        className="mapping-poi-selector__button"
        aria-label={t('poiCycle.previous', { name: activePoi.title })}
        onClick={() => selectOffset(-1)}
      >
        <PoiArrow direction="previous" />
      </button>
      <Tooltip text={t('poiCycle.goToTooltip', { name: activePoi.title })}>
        <button
          type="button"
          className="mapping-poi-selector__button"
          aria-label={t('poiCycle.goToActive', {
            name: activePoi.title,
            category: activePoiCategory,
          })}
          onClick={() => {
            onLocate(activePoi)
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
      </Tooltip>
      <button
        ref={triggerRef}
        type="button"
        className="mapping-poi-selector__active"
        aria-label={t('poiCycle.select', {
          name: activePoi.title,
          category: activePoiCategory,
        })}
        aria-expanded={isListOpen}
        aria-controls={listId}
        onClick={() => setIsListOpen((open) => !open)}
      >
        {ActivePoiIcon && (
          <ActivePoiIcon className="mapping-poi-selector__active-icon" />
        )}
        <span
          className={`mapping-poi-selector__active-title ${activePoi.concealedTitle ? 'mapping-poi-title--concealed' : ''}`}
          aria-hidden={activePoi.concealedTitle ? true : undefined}
        >
          {activePoi.concealedTitle ?? activePoi.title}
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
          {groups.map((group) => (
            <li key={group.id} className="mapping-poi-selector__group">
              <h3
                id={`${listId}-${group.id}`}
                className="mapping-poi-selector__group-title"
              >
                {group.title}
              </h3>
              <ul aria-labelledby={`${listId}-${group.id}`}>
                {group.pois.map((poi) => (
                  <PoiSelectorOption
                    key={poi.id}
                    poi={poi}
                    isActive={poi.id === activePoi.id}
                    categoryLabel={
                      poi.isModuleEntry
                        ? t('moduleEntry.category')
                        : t(`poiCategories.${poi.iconCategory}`)
                    }
                    onSelect={() => {
                      onSelect(poi)
                      setIsListOpen(false)
                      triggerRef.current?.focus()
                    }}
                  />
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </nav>
  )
}

type PoiSelectorOptionProps = {
  poi: MapPoi
  isActive: boolean
  categoryLabel: string
  onSelect: () => void
}

function PoiSelectorOption({
  poi,
  isActive,
  categoryLabel,
  onSelect,
}: PoiSelectorOptionProps) {
  const PoiIcon = poi.icon ?? POI_CATEGORY_ICONS[poi.iconCategory]

  return (
    <li>
      <button
        type="button"
        className="mapping-poi-selector__option"
        aria-label={`${categoryLabel}: ${poi.title}`}
        aria-pressed={isActive}
        onClick={onSelect}
      >
        <span className="mapping-poi-selector__option-main">
          <PoiIcon className="mapping-poi-selector__option-icon" />
          <span
            className={`mapping-poi-selector__option-title ${poi.concealedTitle ? 'mapping-poi-title--concealed' : ''}`}
            aria-hidden={poi.concealedTitle ? true : undefined}
          >
            <span className="sr-only">{categoryLabel}: </span>
            {poi.concealedTitle ?? poi.title}
          </span>
        </span>
        {isActive && (
          <span aria-hidden="true" className="text-pine">
            ✓
          </span>
        )}
      </button>
    </li>
  )
}
