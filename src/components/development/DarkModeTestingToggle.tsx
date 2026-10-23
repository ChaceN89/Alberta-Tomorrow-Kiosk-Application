/**
 * File: DarkModeTestingToggle.tsx | Author: Chace Nielson
 * Created: 2026-10-23 | Updated: 2026-10-23
 * Description: Toggle the document theme from the development tools menu.
 * Dependencies: React state, react-i18next, global theme tokens.
 */
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export function DarkModeTestingToggle() {
  const { t } = useTranslation('development')
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
      aria-label={t(isDarkMode ? 'lightMode' : 'darkMode')}
      aria-pressed={isDarkMode}
      onClick={toggleDarkMode}
      className="dev-tool-menu-button"
    >
      <span aria-hidden="true">{isDarkMode ? '☾' : '☀'}</span>
      {t(isDarkMode ? 'lightMode' : 'darkMode')}
    </button>
  )
}
