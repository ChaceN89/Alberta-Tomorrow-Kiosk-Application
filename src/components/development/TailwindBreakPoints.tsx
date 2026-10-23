/**
 * File: TailwindBreakPoints.tsx | Author: Chace Nielson
 * Created: 2026-10-23 | Updated: 2026-10-23
 * Description: Toggle Tailwind breakpoint guides and their centered legend.
 * Dependencies: React state, Tailwind CSS utilities, react-i18next.
 */
import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'

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

export function TailwindBreakPoints() {
  const { t } = useTranslation('global')
  const [showGuides, setShowGuides] = useState(false)
  const panelId = useId()
  const statusId = useId()

  return (
    <>
      {showGuides && (
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
            id={panelId}
            aria-label={t('development.breakpointPanel')}
            className="pointer-events-none fixed inset-0 z-95 flex items-center justify-center p-4"
          >
            <div className="max-h-[calc(100dvh-2rem)] w-full max-w-xs overflow-auto rounded-xl border border-line bg-surface/70 p-4 text-ink shadow-lg backdrop-blur-sm">
              <h2 className="mb-1 text-base font-semibold">
                {t('development.breakpointPanel')}
              </h2>
              <p className="mb-4 text-sm text-muted">
                {t('development.breakpointLegend')}
              </p>
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
      <button
        type="button"
        aria-label={t('development.toggleBreakpointGuides')}
        aria-pressed={showGuides}
        aria-expanded={showGuides}
        aria-controls={panelId}
        aria-describedby={statusId}
        className="fixed top-20 right-0 z-100 m-1 flex size-10 items-center justify-center rounded-full bg-gray-700 p-1 font-mono text-xs text-white opacity-70 hover:opacity-100 xs:bg-purple-500 sm:bg-pink-500 md:bg-orange-500 lg:bg-green-500 xl:bg-blue-500 2xl:bg-black"
        onClick={() => setShowGuides((visible) => !visible)}
      >
        <span className="block xs:hidden">base</span>
        <span className="hidden xs:block sm:hidden">xs</span>
        <span className="hidden sm:block md:hidden">sm</span>
        <span className="hidden md:block lg:hidden">md</span>
        <span className="hidden lg:block xl:hidden">lg</span>
        <span className="hidden xl:block 2xl:hidden">xl</span>
        <span className="hidden 2xl:block">2xl</span>
      </button>
      <span id={statusId} className="sr-only" aria-live="polite">
        {t(
          showGuides
            ? 'development.breakpointGuidesVisible'
            : 'development.breakpointGuidesHidden',
        )}
      </span>
    </>
  )
}
