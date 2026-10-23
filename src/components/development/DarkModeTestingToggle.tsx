/**
 * File: DarkModeTestingToggle.tsx | Author: Chace Nielson
 * Created: 2026-10-23 | Updated: 2026-10-23
 * Description: Toggle the document's dark theme for development visual checks.
 * Dependencies: React state, react-i18next, global theme tokens.
 */
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export function DarkModeTestingToggle() {
  const { t } = useTranslation('global')
  const [isDarkMode, setIsDarkMode] = useState(() =>
    document.documentElement.classList.contains('dark'),
  )

  const toggleDarkMode = () => {
    const nextDarkMode = !isDarkMode
    document.documentElement.classList.toggle('dark', nextDarkMode)
    setIsDarkMode(nextDarkMode)
  }

  return (
    <button
      type="button"
      aria-label={t(
        isDarkMode ? 'development.lightMode' : 'development.darkMode',
      )}
      aria-pressed={isDarkMode}
      onClick={toggleDarkMode}
      className="fixed top-32 right-0 z-100 m-1 flex size-10 items-center justify-center rounded-full bg-gray-700 p-1 text-xl text-white opacity-70 hover:opacity-100"
    >
      <span aria-hidden="true">{isDarkMode ? '🌙' : '☀️'}</span>
    </button>
  )
}
