/**
  File: AudioPlayerPanel.tsx | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Shared audio and video player with a media queue and full-screen playback.
  - Slides out from the left edge; the active media type selects its playback view.

  Usage:
  - Render once inside Layout. It appears when a track is loaded and opens on play.

  Notes:
  - Closing unfinished media or a player with queued items asks for confirmation.
  - The player and scrollable queue have separate tabs; duplicate queue entries are removable.
  - Close flow, text lookup, and the queue, top bar, media, and confirm pieces are split out.
 */
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { useJournal } from '@/journal/useJournal'
import { MediaPlayerTutorial } from '@/tutorials/media-player-tutorial/MediaPlayerTutorial'
import '@/styles/AudioPlayer.css'
import { useAudioPlayer } from '../hooks/useAudioPlayer'
import { useFullscreenScrollLock } from '../hooks/useFullscreenScrollLock'
import { usePlayerClose } from '../hooks/usePlayerClose'
import { useTrackText } from '../hooks/useTrackText'
import { AudioPlayerControls } from './AudioPlayerControls'
import { AudioPlayerTabs } from './AudioPlayerTabs'
import { CloseConfirmDialog } from './CloseConfirmDialog'
import { FullscreenQueue } from './FullscreenQueue'
import { PlayerMedia } from './PlayerMedia'
import { PlayerTopBar } from './PlayerTopBar'
import { QueueTabView } from './QueueTabView'

export function AudioPlayerPanel() {
  const { t } = useTranslation('moduleTools')
  const { isOpen: isJournalOpen } = useJournal()
  const {
    track,
    isPanelOpen,
    isFullscreen,
    isMediaEndClosing,
    setFullscreen,
    activePanelTab,
  } = useAudioPlayer()
  const { getTrackTitle, getTrackSubtitle } = useTrackText()
  const {
    isConfirmingClose,
    cancelClose,
    closePlayer,
    requestClose,
    stageExitAnimationClass,
    frameExitAnimationClass,
  } = usePlayerClose()

  useFullscreenScrollLock(isFullscreen && track !== null)

  if (!track) return null

  const trackTitle = getTrackTitle(track)
  const trackSubtitle = getTrackSubtitle(track)
  const journalAudioPortalRoot = isJournalOpen
    ? document.getElementById('journal-audio-player-root')
    : null

  if (isJournalOpen && !journalAudioPortalRoot) {
    throw new Error('The journal audio player portal root is missing.')
  }

  const panel = (
    <div
      className={`audio-player-stage ${
        isFullscreen ? 'audio-player-stage--fullscreen' : ''
      } ${stageExitAnimationClass}`}
    >
      <MediaPlayerTutorial />
      <div
        className={`audio-player-frame ${
          isFullscreen ? 'audio-player-frame--fullscreen' : ''
        } ${
          !isPanelOpen && !isFullscreen ? 'audio-player-frame--collapsed' : ''
        } ${frameExitAnimationClass}`}
      >
        <section
          aria-label={t('audioPlayer.label')}
          role={isFullscreen ? 'dialog' : undefined}
          aria-modal={isFullscreen ? true : undefined}
          inert={!isPanelOpen || isMediaEndClosing}
          className={`audio-player-card flex h-full w-full flex-col overflow-hidden border border-line bg-surface text-ink ${
            isFullscreen
              ? 'rounded-2xl shadow-2xl'
              : `rounded-r-2xl border-l-0 ${isPanelOpen ? 'shadow-xl' : ''}`
          }`}
        >
          <div className="audio-panel-view-stack relative h-full">
            <div
              aria-hidden={activePanelTab !== 'player'}
              inert={activePanelTab !== 'player'}
              className={`audio-panel-tab-view audio-panel-tab-view--player flex h-full flex-col ${
                activePanelTab === 'player'
                  ? 'audio-panel-tab-view--active'
                  : 'audio-panel-tab-view--inactive'
              }`}
            >
              <PlayerTopBar
                title={trackTitle}
                isFullscreen={isFullscreen}
                onExitFullscreen={() => setFullscreen(false)}
                onClose={requestClose}
              />
              <PlayerMedia track={track} isFullscreen={isFullscreen} />
              <div
                className={`audio-player-fullscreen-lower ${
                  isFullscreen
                    ? 'audio-player-fullscreen-lower--fullscreen'
                    : ''
                }`}
              >
                <AudioPlayerControls
                  trackTitle={trackTitle}
                  trackSubtitle={trackSubtitle}
                />
                <FullscreenQueue
                  isFullscreen={isFullscreen}
                  getTrackTitle={getTrackTitle}
                />
              </div>
            </div>
            <QueueTabView
              isActive={activePanelTab === 'queue'}
              getTrackTitle={getTrackTitle}
            />
          </div>
        </section>
        <AudioPlayerTabs requestClose={requestClose} />
        {isConfirmingClose && (
          <CloseConfirmDialog
            isCollapsed={!isPanelOpen && !isFullscreen}
            onConfirm={closePlayer}
            onCancel={cancelClose}
          />
        )}
      </div>
    </div>
  )

  return isJournalOpen && journalAudioPortalRoot
    ? createPortal(panel, journalAudioPortalRoot)
    : panel
}
