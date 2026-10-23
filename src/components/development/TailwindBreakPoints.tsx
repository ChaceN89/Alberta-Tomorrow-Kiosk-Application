/**
 * File: TailwindBreakPoints.tsx | Author: Chace Nielson
 * Created: 2026-10-23 | Updated: 2026-10-23
 * Description: Render Tailwind breakpoint guides and their centered legend.
 * Dependencies: Tailwind CSS utilities, react-i18next.
 */
import { useTranslation } from 'react-i18next'

type TailwindBreakPointsProps = {
  visible: boolean
  currentBreakpoint: string
}

const breakpoints = [
  {
    name: 'xs',
    width: '≥ 384px',
    guideWidth: '24rem',
    color: 'bg-purple-500',
    guideColor: 'border-purple-500',
  },
  {
    name: 'sm',
    width: '≥ 640px',
    guideWidth: '40rem',
    color: 'bg-pink-500',
    guideColor: 'border-pink-500',
  },
  {
    name: 'md',
    width: '≥ 768px',
    guideWidth: '48rem',
    color: 'bg-orange-500',
    guideColor: 'border-orange-500',
  },
  {
    name: 'lg',
    width: '≥ 1024px',
    guideWidth: '64rem',
    color: 'bg-green-500',
    guideColor: 'border-green-500',
  },
  {
    name: 'xl',
    width: '≥ 1280px',
    guideWidth: '80rem',
    color: 'bg-blue-500',
    guideColor: 'border-blue-500',
  },
  {
    name: '2xl',
    width: '≥ 1536px',
    guideWidth: '96rem',
    color: 'bg-black',
    guideColor: 'border-black',
  },
]

export function TailwindBreakPoints({
  visible,
  currentBreakpoint,
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
            className="pointer-events-none fixed inset-0 z-90 overflow-hidden"
          >
            {breakpoints.map((breakpoint) => (
              <div
                key={breakpoint.name}
                className={`absolute inset-y-0 left-0 border-l-2 opacity-70 ${breakpoint.guideColor}`}
                style={{ left: breakpoint.guideWidth }}
              />
            ))}
          </div>
          <section
            aria-label={t('breakpointPanel')}
            className="pointer-events-none fixed inset-0 z-95 flex items-center justify-center p-4"
          >
            <div className="max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-auto rounded-xl border border-line bg-surface/65 p-4 text-ink shadow-lg backdrop-blur-md">
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
                {breakpoints.map((breakpoint) => (
                  <li
                    key={breakpoint.name}
                    className="flex items-center gap-3 font-mono text-sm"
                  >
                    <span
                      aria-hidden="true"
                      className={`w-12 border-t-2 ${breakpoint.guideColor}`}
                    />
                    <span className="min-w-8 font-semibold">
                      {breakpoint.name}
                    </span>
                    <span className="text-muted">{breakpoint.width}</span>
                    <span
                      aria-hidden="true"
                      className={`ml-auto size-3 shrink-0 rounded-full ${breakpoint.color}`}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </>
      )}
    </>
  )
}
