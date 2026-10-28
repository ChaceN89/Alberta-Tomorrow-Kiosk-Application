/**
  File: AudioPlayerIcons.tsx | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Small decorative SVG icons used by the audio player controls and tab.

  Usage:
  - Imported by AudioPlayerPanel and TrackPlayButton.

  Notes:
  - Icons are aria-hidden; the buttons that contain them provide accessible names.
 */
type IconProps = {
  className?: string
}

function Icon({
  className = 'size-6',
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  )
}

export function PlayIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M8 5v14l11-7z" />
    </Icon>
  )
}

export function PauseIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
    </Icon>
  )
}

export function FastForwardIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M4 6v12l8.5-6zM12.5 6v12L21 12z" />
    </Icon>
  )
}

export function NextIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M4 5v14l9-7zM14 5h3v14h-3z" />
    </Icon>
  )
}

export function RewindIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M20 6v12l-8.5-6zM11.5 6v12L3 12z" />
    </Icon>
  )
}

export function MusicNoteIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3z" />
    </Icon>
  )
}

export function QueueListIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M3 5h2v2H3zm4 0h14v2H7zM3 11h2v2H3zm4 0h14v2H7zm-4 6h2v2H3zm4 0h10v2H7z" />
    </Icon>
  )
}

export function CloseIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M18.3 5.7a1 1 0 0 0-1.4 0L12 10.6 7.1 5.7a1 1 0 0 0-1.4 1.4l4.9 4.9-4.9 4.9a1 1 0 1 0 1.4 1.4l4.9-4.9 4.9 4.9a1 1 0 0 0 1.4-1.4L13.4 12l4.9-4.9a1 1 0 0 0 0-1.4z" />
    </Icon>
  )
}
