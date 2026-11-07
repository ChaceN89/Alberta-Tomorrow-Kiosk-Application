/**
  File: useModalFocusTrap.ts | Author: Chace Nielson
  Date Created: Nov 6, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Keep keyboard focus inside an app-managed modal while it is active.

  Usage:
  - Pass a modal element ref and whether that modal currently owns focus.

  Notes:
  - The previously focused element is restored when the modal stops owning focus.
 */
import { useEffect, type RefObject } from 'react'

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export function useModalFocusTrap<T extends HTMLElement>(
  dialogRef: RefObject<T | null>,
  isActive: boolean,
) {
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog || !isActive) return

    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null

    const getFocusableElements = () =>
      Array.from(
        dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter(
        (element) =>
          !element.closest('[inert]') &&
          element.getAttribute('aria-hidden') !== 'true' &&
          element.getClientRects().length > 0,
      )

    const focusableElements = getFocusableElements()
    ;(focusableElements[0] ?? dialog).focus({ preventScroll: true })

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return

      const currentFocusableElements = getFocusableElements()
      const first = currentFocusableElements[0]
      const last = currentFocusableElements.at(-1)

      if (!first || !last) {
        event.preventDefault()
        dialog.focus({ preventScroll: true })
      } else if (
        event.shiftKey &&
        (document.activeElement === first ||
          !dialog.contains(document.activeElement))
      ) {
        event.preventDefault()
        last.focus()
      } else if (
        !event.shiftKey &&
        (document.activeElement === last ||
          !dialog.contains(document.activeElement))
      ) {
        event.preventDefault()
        first.focus()
      }
    }

    dialog.addEventListener('keydown', handleKeyDown)

    return () => {
      dialog.removeEventListener('keydown', handleKeyDown)
      if (previouslyFocused?.isConnected) {
        previouslyFocused.focus({ preventScroll: true })
      }
    }
  }, [dialogRef, isActive])
}
