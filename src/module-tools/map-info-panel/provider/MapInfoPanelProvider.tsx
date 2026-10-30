/**
  File: MapInfoPanelProvider.tsx | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Provide the shared map info panel for POI marker interactions.

  Usage:
  - Wrap application routes in MapInfoPanelProvider and call useMapInfoPanel.

  Notes:
  - The panel is hidden when the route changes.
 */
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useLocation } from 'react-router-dom'
import { MapInfoPanel } from '../components/MapInfoPanel'
import { MapInfoPanelContext } from './MapInfoPanelContext'
import type {
  MapInfoPanelCloseOptions,
  MapInfoPanelContent,
  MapInfoPanelOpenOptions,
} from './types'
import '@/styles/MapInfoPanel.css'

type MapInfoPanelProviderProps = {
  children: ReactNode
}

type ActiveMapInfoPanel = {
  content: MapInfoPanelContent
  pathname: string
  isOpen: boolean
}

export function MapInfoPanelProvider({ children }: MapInfoPanelProviderProps) {
  const [activePanel, setActivePanel] = useState<ActiveMapInfoPanel | null>(
    null,
  )
  const originRef = useRef<Element | null>(null)
  const closeTimeoutRef = useRef<number | null>(null)
  const location = useLocation()

  const openPanel = useCallback(
    (nextContent: MapInfoPanelContent, options?: MapInfoPanelOpenOptions) => {
      if (!nextContent.title.trim()) {
        throw new Error('Map info panel content requires a title.')
      }

      if (closeTimeoutRef.current !== null) {
        window.clearTimeout(closeTimeoutRef.current)
        closeTimeoutRef.current = null
      }
      originRef.current = options?.origin ?? null
      setActivePanel({
        content: nextContent,
        pathname: location.pathname,
        isOpen: true,
      })
    },
    [location.pathname],
  )

  const closePanel = useCallback((options?: MapInfoPanelCloseOptions) => {
    setActivePanel((current) =>
      current ? { ...current, isOpen: false } : null,
    )
    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current)
    }
    closeTimeoutRef.current = window.setTimeout(() => {
      setActivePanel((current) => (current?.isOpen === false ? null : current))
      closeTimeoutRef.current = null
    }, 250)
    const origin = originRef.current
    originRef.current = null
    if (options?.restoreFocus !== false && origin instanceof HTMLElement) {
      origin.focus()
    }
  }, [])

  useEffect(() => {
    if (!activePanel || activePanel.pathname === location.pathname) {
      return
    }

    originRef.current = null
    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
  }, [activePanel, location.pathname])

  const content =
    activePanel?.pathname === location.pathname ? activePanel.content : null
  const isOpen =
    activePanel?.pathname === location.pathname && activePanel.isOpen

  useEffect(() => {
    if (!content || !isOpen) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return

      event.preventDefault()
      closePanel()
    }

    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [closePanel, content, isOpen])

  useEffect(
    () => () => {
      if (closeTimeoutRef.current !== null) {
        window.clearTimeout(closeTimeoutRef.current)
      }
    },
    [],
  )

  const value = useMemo(
    () => ({ openPanel, closePanel }),
    [closePanel, openPanel],
  )

  return (
    <MapInfoPanelContext.Provider value={value}>
      {children}
      {content && (
        <MapInfoPanel content={content} isOpen={isOpen} onClose={closePanel} />
      )}
    </MapInfoPanelContext.Provider>
  )
}
