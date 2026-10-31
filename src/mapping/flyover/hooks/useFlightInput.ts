/**
  File: useFlightInput.ts | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Read the flight keys: hold W/S to descend/climb, A/D to steer, and Up/Down
    for speed; press P to pause and Escape to leave flyover.

  Usage:
  - Used by useFlyoverControls. Steering and climbing are read from the returned ref.

  Notes:
  - Keys use physical positions (event.code), so they also work on French keyboards.
  - Flight keys are handled before the focused control sees them, so a slider or
    button that was used earlier cannot swallow them. Typing fields and open
    dialogs still keep their keys.
 */
import { useEffect, useRef } from 'react'
import type { FlightInput } from '../types'

type UseFlightInputOptions = {
  isActive: boolean
  onTogglePause: () => void
  onExit: () => void
}

const TEXT_ENTRY_SELECTOR =
  'input:not([type="range"]):not([type="checkbox"]):not([type="radio"]), textarea, [contenteditable=""], [contenteditable="true"]'
const HELD_KEYS = new Set([
  'KeyA',
  'KeyD',
  'KeyW',
  'KeyS',
  'ArrowUp',
  'ArrowDown',
])

// Function: Decide whether a key press belongs to something other than flying.
function isIgnoredTarget(event: KeyboardEvent) {
  const target = event.target
  if (!(target instanceof Element)) return false

  return (
    event.ctrlKey ||
    event.metaKey ||
    event.altKey ||
    target.matches(TEXT_ENTRY_SELECTOR) ||
    target.closest('dialog') !== null
  )
}

// Function: Track the flight keys while flyover mode is active.
export function useFlightInput({
  isActive,
  onTogglePause,
  onExit,
}: UseFlightInputOptions) {
  const inputRef = useRef<FlightInput>({ turn: 0, climb: 0, throttle: 0 })
  const handlersRef = useRef({ onTogglePause, onExit })

  // The handlers change every render; reading them here keeps held keys held.
  useEffect(() => {
    handlersRef.current = { onTogglePause, onExit }
  })

  useEffect(() => {
    const pressedKeys = new Set<string>()
    const input = inputRef.current

    // Function: Update steering, climbing, and throttle from the keys currently held.
    const syncInput = () => {
      input.turn =
        (pressedKeys.has('KeyD') ? 1 : 0) - (pressedKeys.has('KeyA') ? 1 : 0)
      input.climb =
        (pressedKeys.has('KeyS') ? 1 : 0) - (pressedKeys.has('KeyW') ? 1 : 0)
      input.throttle =
        (pressedKeys.has('ArrowUp') ? 1 : 0) -
        (pressedKeys.has('ArrowDown') ? 1 : 0)
    }
    const releaseAllKeys = () => {
      pressedKeys.clear()
      syncInput()
    }

    if (!isActive) {
      releaseAllKeys()
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (isIgnoredTarget(event)) return

      if (HELD_KEYS.has(event.code)) {
        pressedKeys.add(event.code)
        syncInput()
      } else if (event.code === 'KeyP') {
        if (!event.repeat) handlersRef.current.onTogglePause()
      } else if (event.code === 'Escape') {
        if (!event.repeat) handlersRef.current.onExit()
        return
      } else {
        return
      }

      event.preventDefault()
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (!pressedKeys.delete(event.code)) return

      syncInput()
    }

    window.addEventListener('keydown', handleKeyDown, true)
    window.addEventListener('keyup', handleKeyUp, true)
    window.addEventListener('blur', releaseAllKeys)
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true)
      window.removeEventListener('keyup', handleKeyUp, true)
      window.removeEventListener('blur', releaseAllKeys)
      releaseAllKeys()
    }
  }, [isActive])

  return inputRef
}
