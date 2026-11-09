/**
  File: usePlaneLaunchShortcut.ts | Author: Chace Nielson
  Date Created: Nov 9, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Launch flyover with P while the map is not in flight.

  Usage:
  - Used by AlbertaMap; active flight keeps its existing P pause shortcut.

  Notes:
  - Typing, modified shortcuts, and modal dialogs retain their keyboard input.
 */
import { useEffect, useRef } from 'react'
import { EXPLORE_MAP_TUTORIAL_FINISH_REQUEST } from '@/tutorials/specific-tutorials/explore-map/exploreMapTutorialEvents'
import { isFlightShortcutIgnored } from '../utils/flightKeyboard'

export function usePlaneLaunchShortcut({
  isEnabled,
  onLaunch,
}: {
  isEnabled: boolean
  onLaunch: () => void
}) {
  const launch = useRef(onLaunch)
  useEffect(() => {
    launch.current = onLaunch
  }, [onLaunch])
  useEffect(() => {
    if (!isEnabled) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.code !== 'KeyP' ||
        event.repeat ||
        event.defaultPrevented ||
        isFlightShortcutIgnored(event)
      )
        return
      event.preventDefault()
      window.dispatchEvent(new Event(EXPLORE_MAP_TUTORIAL_FINISH_REQUEST))
      launch.current()
    }
    window.addEventListener('keydown', handleKeyDown, true)
    return () => window.removeEventListener('keydown', handleKeyDown, true)
  }, [isEnabled])
}
