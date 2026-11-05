/**
  File: Icon.tsx | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Nov 5, 2026

  Description:
  - Provide shared SVG defaults for general-purpose interface icons.

  Usage:
  - Wrap decorative icon paths; the containing control provides its accessible name.

  Notes:
  - Uses the app's outlined, current-color icon style.
 */
type IconProps = {
  className: string
  children: React.ReactNode
  strokeWidth?: number
  strokeLinecap?: 'butt' | 'round' | 'square'
}

export function Icon({
  className,
  children,
  strokeWidth = 2,
  strokeLinecap = 'round',
}: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap={strokeLinecap}
      strokeLinejoin="round"
    >
      {children}
    </svg>
  )
}
