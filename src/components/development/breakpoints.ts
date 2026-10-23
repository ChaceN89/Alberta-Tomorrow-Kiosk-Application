/**
 * File: breakpoints.ts | Author: Chace Nielson
 * Created: 2026-10-23 | Updated: 2026-10-23
 * Description: Provide the active Tailwind breakpoint for a viewport width.
 * Dependencies: Tailwind breakpoint values from global.css.
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
