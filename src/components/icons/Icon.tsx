/**
  File: Icon.tsx | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Oct 28, 2026

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
}

export function Icon({ className, children }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  )
}
