/**
  File: GlobalOverlayLayer.tsx | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Keep the developer tools, notification toasts, and status toasts at their layer.

  Usage:
  - Render once inside the application providers, after startup finishes.

  Notes:
  - Modal dialogs make everything outside them inert, so the developer-tools and
    notification hosts move into the topmost open dialog without remounting.
  - The host never moves into a dialog it contains; render dialogs opened from
    the developer tools outside the host (see StatePreview).
  - Status toasts stay in the page so every dialog and media tool covers them.
 */
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { DisplayTesting } from '@/components/development/dev-tools/DisplayTesting'
import { ToastLayer } from './ToastLayer'

function createOverlayHosts() {
  const developerTools = document.createElement('div')
  developerTools.id = 'global-dev-tools-host'
  developerTools.setAttribute('popover', 'manual')
  Object.assign(developerTools.style, {
    background: 'transparent',
    border: '0',
    color: 'inherit',
    height: '100%',
    inset: '0',
    margin: '0',
    maxHeight: 'none',
    maxWidth: 'none',
    overflow: 'visible',
    padding: '0',
    pointerEvents: 'none',
    position: 'fixed',
    width: '100%',
    // Fallback for browsers without the popover top layer.
    zIndex: 'var(--z-dev-tools)',
  })

  const notifications = document.createElement('div')
  notifications.id = 'global-notification-host'
  notifications.className = 'contents'

  return { developerTools, notifications }
}

// Showing the popover again also moves it back to the top of the top layer.
function showDeveloperTools(host: HTMLElement) {
  if (
    typeof host.showPopover === 'function' &&
    host.isConnected &&
    !host.matches(':popover-open')
  ) {
    host.showPopover()
  }
}

function moveHost(host: HTMLElement, target: Element) {
  if (host.parentElement === target || host.contains(target)) return

  const focused = host.contains(document.activeElement)
    ? (document.activeElement as HTMLElement)
    : null

  if (typeof host.hidePopover === 'function' && host.matches(':popover-open')) {
    host.hidePopover()
  }

  target.appendChild(host)
  focused?.focus({ preventScroll: true })
}

export function GlobalOverlayLayer() {
  const isDevelopment = import.meta.env.VITE_ENVIRONMENT === 'development'
  const [hosts] = useState(createOverlayHosts)
  const [topDialog, setTopDialog] = useState<HTMLDialogElement | null>(null)
  const openDialogs = useRef<HTMLDialogElement[]>([])

  // Track the open dialogs in the order they opened; the last one is on top.
  useEffect(() => {
    const updateTopDialog = () => {
      const open = Array.from(
        document.querySelectorAll<HTMLDialogElement>('dialog[open]'),
      ).filter(
        (dialog) =>
          !hosts.developerTools.contains(dialog) &&
          !hosts.notifications.contains(dialog),
      )
      const stillOpen = openDialogs.current.filter((dialog) =>
        open.includes(dialog),
      )

      openDialogs.current = [
        ...stillOpen,
        ...open.filter((dialog) => !stillOpen.includes(dialog)),
      ]
      setTopDialog(openDialogs.current.at(-1) ?? null)
    }

    const observer = new MutationObserver(updateTopDialog)
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['open'],
      childList: true,
      subtree: true,
    })
    updateTopDialog()

    return () => observer.disconnect()
  }, [hosts])

  useEffect(() => {
    const target = topDialog ?? document.body

    moveHost(hosts.notifications, target)
    moveHost(hosts.developerTools, target)
    if (isDevelopment) showDeveloperTools(hosts.developerTools)
  }, [hosts, isDevelopment, topDialog])

  useEffect(
    () => () => {
      if (
        typeof hosts.developerTools.hidePopover === 'function' &&
        hosts.developerTools.matches(':popover-open')
      ) {
        hosts.developerTools.hidePopover()
      }
      hosts.developerTools.remove()
      hosts.notifications.remove()
    },
    [hosts],
  )

  return (
    <>
      <ToastLayer layer="status" />
      {createPortal(
        <div id="global-dev-tools-root" className="contents">
          <DisplayTesting />
        </div>,
        hosts.developerTools,
      )}
      {createPortal(<ToastLayer layer="notification" />, hosts.notifications)}
    </>
  )
}
