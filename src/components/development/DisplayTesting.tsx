/**
 * File: DisplayTesting.tsx | Author: Chace Nielson
 * Created: 2026-10-23 | Updated: 2026-10-23
 * Description: Render development-only responsive and theme testing controls.
 * Dependencies: Vite environment flags, TailwindBreakPoints, DarkModeTestingToggle.
 */
import { DarkModeTestingToggle } from './DarkModeTestingToggle'
import { TailwindBreakPoints } from './TailwindBreakPoints'

export function DisplayTesting() {
  const isDevelopment =
    import.meta.env.DEV && import.meta.env.VITE_ENVIRONMENT === 'development'

  if (!isDevelopment) return null

  return (
    <>
      <TailwindBreakPoints />
      <DarkModeTestingToggle />
    </>
  )
}
