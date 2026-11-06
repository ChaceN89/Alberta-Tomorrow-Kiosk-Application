/**
  File: MediaTitle.tsx | Author: Chace Nielson
  Date Created: Nov 6, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Show the active media title beside collapsed player tabs on playback start or when Play is hovered.

  Usage:
  - Render from AudioPlayerPanel with the active track's localized title, subtitle, and tab state.

  Notes:
  - Appears only when playback starts while the player is collapsed.
 */
import { MusicNoteIcon } from '@/components/icons/MusicNoteIcon'
import { VideoIcon } from '@/components/icons/VideoIcon'
import type { MediaTrack } from '../provider/types'

type MediaTitleProps = {
  track: MediaTrack
  title: string
  subtitle?: string
  isCollapsed: boolean
  isPlaying: boolean
  isPlaybackTabHovered: boolean
  collapsedPlaybackStartSequence: number
}

export function MediaTitle({
  track,
  title,
  subtitle,
  isCollapsed,
  isPlaying,
  isPlaybackTabHovered,
  collapsedPlaybackStartSequence,
}: MediaTitleProps) {
  const isPlaybackPreview = isCollapsed && !isPlaying && isPlaybackTabHovered
  const isPlaybackStart =
    isCollapsed && isPlaying && collapsedPlaybackStartSequence > 0
  const shouldShow = isPlaybackPreview || isPlaybackStart

  return (
    <aside
      key={collapsedPlaybackStartSequence}
      role={isPlaybackStart ? 'status' : undefined}
      aria-live={isPlaybackStart ? 'polite' : undefined}
      aria-hidden={!shouldShow}
      className={`audio-player-media-title rounded-xl border border-line bg-surface px-3 py-2 shadow-xl ${
        shouldShow
          ? `audio-player-media-title--visible ${
              isPlaybackPreview ? 'audio-player-media-title--hovered' : ''
            }`
          : 'audio-player-media-title--hidden'
      }`}
    >
      <div className="flex min-h-12 items-stretch gap-3">
        <span className="flex w-10 shrink-0 items-center justify-center text-pine">
          {track.type === 'audio' ? (
            <MusicNoteIcon className="size-full" />
          ) : (
            <VideoIcon className="size-full" />
          )}
        </span>
        <span className="flex min-w-0 flex-1 flex-col justify-center">
          <span className="truncate text-sm font-semibold leading-5">
            {title}
          </span>
          {subtitle && (
            <span className="truncate text-xs leading-4 text-muted">
              {subtitle}
            </span>
          )}
        </span>
      </div>
    </aside>
  )
}
