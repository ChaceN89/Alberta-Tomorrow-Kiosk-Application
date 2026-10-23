/**
 * File: ErrorBoundary.tsx | Author: Chace Nielson
 * Created: 2026-10-23 | Updated: 2026-10-23
 * Description: Catch render and lazy-loading failures with localized recovery.
 * Dependencies: React, react-i18next; full navigation resets the boundary.
 */
import { Component, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

function ErrorFallback() {
  const { t } = useTranslation('global')

  return (
    <main className="mx-auto max-w-2xl px-6 py-14">
      <section role="alert" className="panel space-y-5">
        <h1>{t('error.title')}</h1>
        <p>{t('error.description')}</p>
        <a href="/" className="button">
          {t('navigation.returnHome')}
        </a>
      </section>
    </main>
  )
}

export class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    return this.state.hasError ? <ErrorFallback /> : this.props.children
  }
}
