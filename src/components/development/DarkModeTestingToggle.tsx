/**
  File: DarkModeTestingToggle.tsx | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 23, 2026

  Description:
  - Toggle the document theme from the development tools menu.

  Usage:
  - Shared and app-state UI is imported by app or feature flows.

  Notes:
  - None.
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
