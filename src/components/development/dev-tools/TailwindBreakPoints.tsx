/**
  File: TailwindBreakPoints.tsx | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Render Tailwind breakpoint guides and their centered legend.

  Usage:
  - Shared and app-state UI is imported by app or feature flows.

  Notes:
  - None.
 */
import { useTranslation } from 'react-i18next'
import type { TailwindBreakpoint, TailwindBreakpointName } from './breakpoints'

type TailwindBreakPointsProps = {
  visible: boolean
  currentBreakpoint: string
  breakpoints: readonly TailwindBreakpoint[]
}

const breakpointColors = {
  xs: { dot: 'bg-purple-500', guide: 'border-purple-500' },
  sm: { dot: 'bg-pink-500', guide: 'border-pink-500' },
  md: { dot: 'bg-orange-500', guide: 'border-orange-500' },
  lg: { dot: 'bg-green-500', guide: 'border-green-500' },
  xl: { dot: 'bg-blue-500', guide: 'border-blue-500' },
  '2xl': { dot: 'bg-black', guide: 'border-black' },
} satisfies Record<TailwindBreakpointName, { dot: string; guide: string }>

export function TailwindBreakPoints({
  visible,
  currentBreakpoint,
  breakpoints,
}: TailwindBreakPointsProps) {
  const { t } = useTranslation('development')

  return (
    <>
      <span className="sr-only" aria-live="polite">
        {t('currentBreakpoint', { breakpoint: currentBreakpoint })}
      </span>
      {visible && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-(--z-dev-guides) overflow-hidden"
          >
            {breakpoints.map((breakpoint) => {
              const colors = breakpointColors[breakpoint.name]

              return (
                <div
                  key={breakpoint.name}
                  className={`absolute inset-y-0 left-0 border-l-2 opacity-70 ${colors.guide}`}
                  style={{ left: `${breakpoint.minWidth}px` }}
                />
              )
            })}
          </div>
          <section
            aria-label={t('breakpointPanel')}
            className="pointer-events-none fixed inset-0 z-(--z-dev-guides) flex items-center justify-center p-4"
          >
            <div className="max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-auto rounded-xl border border-line bg-surface p-4 text-ink shadow-lg">
              <div className="mb-1 flex items-center justify-between gap-4">
                <h2 className="text-base font-semibold">
                  {t('breakpointPanel')}
                </h2>
                <span
                  className="rounded-full bg-surface px-2 py-0.5 font-mono text-xs font-bold text-pine"
                  aria-label={t('currentBreakpoint', {
                    breakpoint: currentBreakpoint,
                  })}
                >
                  {currentBreakpoint}
                </span>
              </div>
              <p className="mb-4 text-sm text-muted">{t('breakpointLegend')}</p>
              <ul className="space-y-3">
                {breakpoints.map((breakpoint) => {
                  const colors = breakpointColors[breakpoint.name]

                  return (
                    <li
                      key={breakpoint.name}
                      className="flex items-center gap-3 font-mono text-sm"
                    >
                      <span
                        aria-hidden="true"
                        className={`w-12 border-t-2 ${colors.guide}`}
                      />
                      <span className="min-w-8 font-semibold">
                        {breakpoint.name}
                      </span>
                      <span className="text-muted">
                        ≥ {breakpoint.minWidth}px
                      </span>
                      <span
                        aria-hidden="true"
                        className={`ml-auto size-3 shrink-0 rounded-full ${colors.dot}`}
                      />
                    </li>
                  )
                })}
              </ul>
            </div>
          </section>
        </>
      )}
    </>
  )
}
