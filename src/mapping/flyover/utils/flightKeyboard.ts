/**
  File: flightKeyboard.ts | Author: Chace Nielson
  Date Created: Nov 9, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Keep plane shortcuts out of typing fields and modal interactions.

  Usage:
  - Shared by flight input and the P launch shortcut.

  Notes:
  - Sliders, checkboxes, and ordinary buttons keep the plane shortcuts available.
 */
const TEXT_ENTRY_SELECTOR =
  'input:not([type="range"]):not([type="checkbox"]):not([type="radio"]), select, textarea, [contenteditable]:not([contenteditable="false"])'

export function isFlightShortcutIgnored(event: KeyboardEvent) {
  const target = event.target
  return (
    event.ctrlKey ||
    event.metaKey ||
    event.altKey ||
    document.querySelector('dialog[open], [aria-modal="true"]') !== null ||
    (target instanceof Element && target.closest(TEXT_ENTRY_SELECTOR) !== null)
  )
}
