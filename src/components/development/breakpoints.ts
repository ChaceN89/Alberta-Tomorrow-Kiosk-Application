/**
  File: breakpoints.ts | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 23, 2026

  Description:
  - Provide the active Tailwind breakpoint for a viewport width.

  Usage:
  - Shared and app-state UI is imported by app or feature flows.

  Notes:
  - None.
 */
const breakpoints = [
  { name: 'xs', minWidth: 384 },
  { name: 'sm', minWidth: 640 },
  { name: 'md', minWidth: 768 },
  { name: 'lg', minWidth: 1024 },
  { name: 'xl', minWidth: 1280 },
  { name: '2xl', minWidth: 1536 },
]

export function getCurrentBreakpoint(width: number) {
  return (
    [...breakpoints]
      .reverse()
      .find((breakpoint) => width >= breakpoint.minWidth)?.name ?? 'base'
  )
}
