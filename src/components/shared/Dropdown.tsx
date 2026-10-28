/**
  File: Dropdown.tsx | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 23, 2026

  Description:
  - Provide a reusable accessible action menu with keyboard navigation.

  Usage:
  - Shared and app-state UI is imported by app or feature flows.

  Notes:
  - None.
 */
import { useEffect, useId, useRef, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'

export type DropdownItem = {
  id: string
  label: string
  icon?: ReactNode
}

type DropdownProps = {
  ariaLabel: string
  items: readonly DropdownItem[]
  onSelect: (item: DropdownItem) => void
  selectedId?: string
  triggerLabel: string
}

export function Dropdown({
  ariaLabel,
  items,
  onSelect,
  selectedId,
  triggerLabel,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([])
  const focusIndexRef = useRef(0)

  useEffect(() => {
    if (!isOpen) return

    itemRefs.current[focusIndexRef.current]?.focus()
    focusIndexRef.current = 0

    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('pointerdown', closeOnOutsidePointer)
    return () =>
      document.removeEventListener('pointerdown', closeOnOutsidePointer)
  }, [isOpen])

  const handleItemKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let nextIndex: number | undefined

    if (event.key === 'ArrowDown') nextIndex = (index + 1) % items.length
    if (event.key === 'ArrowUp')
      nextIndex = (index - 1 + items.length) % items.length
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = items.length - 1

    if (nextIndex !== undefined) {
      event.preventDefault()
      itemRefs.current[nextIndex]?.focus()
      return
    }

    if (event.key === 'Escape') {
      event.preventDefault()
      setIsOpen(false)
      triggerRef.current?.focus()
    }

    if (event.key === 'Tab') setIsOpen(false)
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={dropdownId}
        disabled={items.length === 0}
        className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-line bg-surface px-3 font-semibold text-ink hover:bg-canvas"
        onClick={() => setIsOpen((open) => !open)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault()
            focusIndexRef.current =
              event.key === 'ArrowUp' ? items.length - 1 : 0
            setIsOpen(true)
          }
        }}
      >
        {triggerLabel}
        <span aria-hidden="true" className="text-xs">
          ▾
        </span>
      </button>
      {isOpen && (
        <div
          id={dropdownId}
          role="menu"
          aria-label={ariaLabel}
          className="absolute right-0 z-50 mt-2 min-w-full overflow-hidden rounded-xl border border-line bg-surface p-1 shadow-lg"
        >
          {items.map((item, index) => (
            <button
              key={item.id}
              ref={(element) => {
                itemRefs.current[index] = element
              }}
              type="button"
              role={selectedId === undefined ? 'menuitem' : 'menuitemradio'}
              aria-checked={
                selectedId === undefined ? undefined : selectedId === item.id
              }
              className="flex min-h-12 w-full items-center gap-3 rounded-lg px-3 text-left text-ink hover:bg-canvas focus-visible:bg-canvas"
              onClick={() => {
                onSelect(item)
                setIsOpen(false)
                triggerRef.current?.focus()
              }}
              onKeyDown={(event) => handleItemKeyDown(event, index)}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
