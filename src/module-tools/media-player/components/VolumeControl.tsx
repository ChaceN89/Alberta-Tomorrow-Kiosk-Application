/**
  File: VolumeControl.tsx | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Show the volume button and its vertical slider popover.

  Usage:
  - Rendered in AudioPlayerControls for audio tracks.

  Notes:
  - The parent owns the open state so playback and closing can also dismiss it.
  - Escape closes the popover while it is open.
 */
import { useEffect, useId } from 'react'
import { useTranslation } from 'react-i18next'
import { Tooltip } from '@/components/shared/Tooltip'
import { VolumeIcon } from './AudioPlayerIcons'

type VolumeControlProps = {
  isOpen: boolean
  volume: number
  onToggle: () => void
  onClose: () => void
  onVolumeChange: (volume: number) => void
}

export function VolumeControl({
  isOpen,
  volume,
  onToggle,
  onClose,
  onVolumeChange,
}: VolumeControlProps) {
  const { t } = useTranslation('moduleTools')
  const controlId = useId()

  useEffect(() => {
    if (!isOpen) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [isOpen, onClose])

  return (
    <div className="relative">
      <Tooltip text={t('audioPlayer.volume')}>
        <button
          type="button"
          className="flex size-10 items-center justify-center rounded-lg text-muted hover:bg-canvas"
          aria-label={t('audioPlayer.volume')}
          aria-expanded={isOpen}
          aria-controls={controlId}
          onClick={onToggle}
        >
          <VolumeIcon className="size-5" />
        </button>
      </Tooltip>
      {isOpen && (
        <div
          id={controlId}
          className="absolute right-full top-1/2 z-30 mr-2 flex -translate-y-1/2 flex-col items-center gap-2 rounded-xl border border-line bg-surface p-3 text-ink shadow-xl"
        >
          <label htmlFor="audio-player-volume" className="sr-only">
            {t('audioPlayer.volume')}
          </label>
          <input
            id="audio-player-volume"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            aria-valuetext={t('audioPlayer.volumeValue', {
              percent: Math.round(volume * 100),
            })}
            className="h-32 w-8 cursor-pointer accent-pine"
            style={{ writingMode: 'vertical-lr', direction: 'rtl' }}
            onChange={(event) => onVolumeChange(event.target.valueAsNumber)}
          />
          <span className="text-xs text-muted tabular-nums">
            {Math.round(volume * 100)}%
          </span>
        </div>
      )}
    </div>
  )
}
