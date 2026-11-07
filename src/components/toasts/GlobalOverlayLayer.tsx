/**
  File: GlobalOverlayLayer.tsx | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Keep the media player, developer tools, and toasts in one persistent global layer.

  Usage:
  - Render once inside the application providers, after startup finishes.

  Notes:
  - The host is shown once and never moves when other overlays open or close.
  - Keep global overlays out of native modal dialogs, which make outside content inert.
 */
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { DisplayTesting } from '@/components/development/dev-tools/DisplayTesting'
import { ToastLayer } from './ToastLayer'

function createGlobalOverlayHost() {
  const host = document.createElement('div')
  host.id = 'global-overlay-host'
  host.setAttribute('popover', 'manual')
  Object.assign(host.style, {
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
    zIndex: 'var(--z-global-overlay)',
  })

  return host
}

function showHost(host: HTMLElement) {
  if (
    typeof host.showPopover === 'function' &&
    host.isConnected &&
    !host.matches(':popover-open')
  ) {
    host.showPopover()
  }
}

export type GlobalOverlayLayerProps = {
  mediaPlayer: ReactNode
}

export function GlobalOverlayLayer({ mediaPlayer }: GlobalOverlayLayerProps) {
  const isDevelopment = import.meta.env.VITE_ENVIRONMENT === 'development'
  const [host] = useState(createGlobalOverlayHost)

  useEffect(() => {
    document.body.appendChild(host)
    showHost(host)

    return () => {
      if (
        typeof host.hidePopover === 'function' &&
        host.matches(':popover-open')
      ) {
        host.hidePopover()
      }
      host.remove()
    }
  }, [host])

  return createPortal(
    <>
      <div id="global-media-player-root" className="contents">
        {mediaPlayer}
      </div>
      {isDevelopment && (
        <div id="global-dev-tools-root" className="contents">
          <DisplayTesting />
        </div>
      )}
      <ToastLayer layer="status" />
      <ToastLayer layer="notification" />
    </>,
    host,
  )
}
