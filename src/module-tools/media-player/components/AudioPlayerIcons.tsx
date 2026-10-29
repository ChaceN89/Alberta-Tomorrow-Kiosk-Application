/**
  File: AudioPlayerIcons.tsx | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Small decorative SVG icons used by the shared media player controls and tab.

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

export function VideoIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <rect
        x="3"
        y="6"
        width="12"
        height="12"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="m15 10 6-4v12l-6-4"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </Icon>
  )
}

export function FullscreenIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M3 9V3h6v2H5v4H3zm12-6h6v6h-2V5h-4V3zM3 15h2v4h4v2H3v-6zm16 4v-4h2v6h-6v-2h4z" />
    </Icon>
  )
}

export function ExitFullscreenIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M9 3h2v8H3V9h6V3zm12 6v2h-8V3h2v6h6zM9 21v-6H3v-2h8v8H9zm12-8v2h-6v6h-2v-8h8z" />
    </Icon>
  )
}

export function VolumeIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M3 9v6h4l5 4V5L7 9H3zm12.5 3a3.5 3.5 0 0 0-2-3.16v6.32a3.5 3.5 0 0 0 2-3.16zm-2-7.5v2.06a6 6 0 0 1 0 10.88v2.06a8 8 0 0 0 0-15z" />
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

export function AddToQueueIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M3 5h2v2H3zm4 0h14v2H7zM3 11h2v2H3zm4 0h8v2H7zm-4 6h2v2H3zm4 0h8v2H7zm11-2v3h3v2h-3v3h-2v-3h-3v-2h3v-3z" />
    </Icon>
  )
}

export function MoveUpIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="m12 4 7 7-1.4 1.4L13 7.8V20h-2V7.8l-4.6 4.6L5 11z" />
    </Icon>
  )
}

export function MoveDownIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="m12 20-7-7 1.4-1.4 4.6 4.6V4h2v12.2l4.6-4.6L19 13z" />
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
