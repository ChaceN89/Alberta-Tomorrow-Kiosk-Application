/**
  File: breakpoints.ts | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Provide the active Tailwind breakpoint for a viewport width.

  Usage:
  - Shared and app-state UI is imported by app or feature flows.

  Notes:
  - None.
 */
export const breakpointNames = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const

export type TailwindBreakpointName = (typeof breakpointNames)[number]

export type TailwindBreakpoint = {
  name: TailwindBreakpointName
  minWidth: number
}

export function getTailwindBreakpoints(): TailwindBreakpoint[] {
  const root = document.documentElement
  const probe = document.createElement('span')
  const styles = getComputedStyle(root)

  probe.style.cssText =
    'position:absolute;visibility:hidden;pointer-events:none;height:0;'
  root.append(probe)

  try {
    return breakpointNames
      .map((name) => {
        const value = styles.getPropertyValue(`--breakpoint-${name}`).trim()

        if (!value) {
          throw new Error(
            `Tailwind breakpoint "--breakpoint-${name}" is not available in the computed theme.`,
          )
        }

        probe.style.width = `var(--breakpoint-${name})`
        const minWidth = probe.getBoundingClientRect().width

        if (!Number.isFinite(minWidth) || minWidth <= 0) {
          throw new Error(
            `Tailwind breakpoint "--breakpoint-${name}" has an invalid value "${value}".`,
          )
        }

        return { name, minWidth }
      })
      .sort((left, right) => left.minWidth - right.minWidth)
  } finally {
    probe.remove()
  }
}

export function getCurrentBreakpoint(
  width: number,
  breakpoints: readonly TailwindBreakpoint[],
) {
  return (
    [...breakpoints]
      .reverse()
      .find((breakpoint) => width >= breakpoint.minWidth)?.name ?? 'base'
  )
}
