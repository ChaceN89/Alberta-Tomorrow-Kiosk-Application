/**
  File: AudioPlayerTabs.tsx | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Render the player, queue, playback, and close tabs beside the player frame.

  Usage:
  - AudioPlayerPanel renders the tabs and supplies its close-confirmation handler.

  Notes:
  - All four tabs share the same position and entrance animation.
 */
import { useTranslation } from 'react-i18next'
import { Tooltip } from '@/components/shared/Tooltip'
import { requestMediaPlayerTutorialDismissalForPlayback } from '@/tutorials/media-player-tutorial/mediaPlayerTutorialEvents'
import {
  CloseIcon,
  MusicNoteIcon,
  PauseIcon,
  PlayIcon,
  QueueListIcon,
} from './AudioPlayerIcons'
import { useAudioPlayer } from './useAudioPlayer'

type AudioPlayerTabsProps = {
  requestClose: () => void
}

function EqualizerBars() {
  return (
    <span aria-hidden="true" className="flex h-5 items-end gap-0.5">
      {[0, 200, 400].map((delay) => (
        <span
          key={delay}
          className="audio-bar h-full w-1 rounded-full bg-current"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </span>
  )
}

export function AudioPlayerTabs({ requestClose }: AudioPlayerTabsProps) {
  const { t } = useTranslation('moduleTools')
  const {
    isPlaying,
    isPanelOpen,
    isFullscreen,
    activePanelTab,
    queue,
    togglePlayback,
    setPanelOpen,
    setActivePanelTab,
  } = useAudioPlayer()

  const selectTab = (nextTab: 'player' | 'queue') => {
    if (isPanelOpen && activePanelTab === nextTab) {
      setPanelOpen(false)
      return
    }

    setActivePanelTab(nextTab)
    setPanelOpen(true)
  }
  const handlePlaybackRequest = () => {
    if (!isPlaying) requestMediaPlayerTutorialDismissalForPlayback()
    togglePlayback()
  }
  const playerTabLabel = t(
    isPanelOpen && activePanelTab === 'player'
      ? 'audioPlayer.collapse'
      : isPlaying
        ? 'audioPlayer.expandPlaying'
        : 'audioPlayer.showPlayer',
  )
  const playbackTabLabel = t(
    isPlaying ? 'audioPlayer.pause' : 'audioPlayer.play',
  )
  const queueTabLabel = t('audioPlayer.openQueueWithCount', {
    count: queue.length,
  })
  const sideTabClass = isFullscreen
    ? 'audio-player-tab--hidden'
    : !isPanelOpen
      ? 'audio-player-tab-enter'
      : ''
  const buttonClass =
    'audio-player-tab-button pointer-events-auto flex h-16 w-10 items-center justify-center rounded-r-xl border border-l-0 border-line shadow-lg transition-transform duration-200 ease-out motion-reduce:transition-none'

  const playerTab = (
    <button
      type="button"
      className={`${buttonClass} bg-pine text-white`}
      aria-expanded={isPanelOpen && activePanelTab === 'player'}
      aria-label={playerTabLabel}
      onClick={() => selectTab('player')}
    >
      {isPlaying ? <EqualizerBars /> : <MusicNoteIcon className="size-5" />}
    </button>
  )
  const queueTab = (
    <button
      type="button"
      className={`${buttonClass} relative bg-pine text-white`}
      aria-expanded={isPanelOpen && activePanelTab === 'queue'}
      aria-label={queueTabLabel}
      onClick={() => selectTab('queue')}
    >
      <QueueListIcon className="size-5" />
      {queue.length > 0 && (
        <span
          aria-hidden="true"
          className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border border-pine bg-surface px-1 text-[10px] font-bold leading-none text-pine shadow-sm"
        >
          {queue.length > 99 ? '99+' : queue.length}
        </span>
      )}
    </button>
  )
  const playbackTab = (
    <button
      type="button"
      className={`${buttonClass} bg-surface text-pine`}
      aria-label={playbackTabLabel}
      onClick={handlePlaybackRequest}
    >
      {isPlaying ? (
        <PauseIcon className="size-5" />
      ) : (
        <PlayIcon className="size-5" />
      )}
    </button>
  )
  const closeTab = (
    <button
      type="button"
      className={`${buttonClass} bg-flag text-white`}
      aria-label={t('audioPlayer.close')}
      onClick={requestClose}
    >
      <CloseIcon className="size-5" />
    </button>
  )

  return (
    <>
      {[
        {
          className: 'bottom-55',
          tutorialAnchor: 'player-tabs',
          button: closeTab,
          label: t('audioPlayer.close'),
        },
        {
          className: 'bottom-38',
          tutorialAnchor: undefined,
          button: playbackTab,
          label: playbackTabLabel,
        },
        {
          className: 'bottom-21',
          tutorialAnchor: 'player-tab',
          button: playerTab,
          label: playerTabLabel,
        },
        {
          className: 'bottom-4',
          tutorialAnchor: undefined,
          button: queueTab,
          label: queueTabLabel,
        },
      ].map(({ className, tutorialAnchor, button, label }) => (
        <div
          key={className}
          inert={isFullscreen}
          aria-hidden={isFullscreen}
          data-media-player-tutorial={tutorialAnchor}
          className={`audio-player-tab absolute ${className} left-full ${sideTabClass}`}
        >
          {isPanelOpen ? button : <Tooltip text={label}>{button}</Tooltip>}
        </div>
      ))}
    </>
  )
}
