/**
  File: PlayerTopBar.tsx | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Show the media title with exit full screen and close buttons above the media.

  Usage:
  - Rendered by AudioPlayerPanel; it grows in only while the player is full screen.

  Notes:
  - Hidden and inert while compact so its buttons are not reachable.
 */
import { useTranslation } from 'react-i18next'
import { Tooltip } from '@/components/shared/Tooltip'
import { CloseIcon, ExitFullscreenIcon } from './AudioPlayerIcons'

type PlayerTopBarProps = {
  title: string
  isFullscreen: boolean
  onExitFullscreen: () => void
  onClose: () => void
}

const topBarButtonClass =
  'flex size-10 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-canvas'

export function PlayerTopBar({
  title,
  isFullscreen,
  onExitFullscreen,
  onClose,
}: PlayerTopBarProps) {
  const { t } = useTranslation('moduleTools')

  return (
    <header
      aria-hidden={!isFullscreen}
      inert={!isFullscreen}
      className={`audio-player-topbar ${
        isFullscreen ? 'audio-player-topbar--visible' : ''
      }`}
    >
      <h2 className="min-w-0 flex-1 truncate font-semibold">{title}</h2>
      <Tooltip text={t('audioPlayer.exitFullscreen')}>
        <button
          type="button"
          className={topBarButtonClass}
          aria-label={t('audioPlayer.exitFullscreen')}
          onClick={onExitFullscreen}
        >
          <ExitFullscreenIcon className="size-5" />
        </button>
      </Tooltip>
      <Tooltip text={t('audioPlayer.close')}>
        <button
          type="button"
          className={topBarButtonClass}
          aria-label={t('audioPlayer.close')}
          onClick={onClose}
        >
          <CloseIcon className="size-5" />
        </button>
      </Tooltip>
    </header>
  )
}
