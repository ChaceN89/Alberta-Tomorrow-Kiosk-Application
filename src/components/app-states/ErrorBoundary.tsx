/**
  File: ErrorBoundary.tsx | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Catch application render failures with localized recovery.

  Usage:
  - Shared and app-state UI is imported by app or feature flows.

  Notes:
  - None.
 */
import { Component, type ErrorInfo, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

type ErrorFallbackProps = {
  error: Error | null
  componentStack: string | null
}

function ErrorFallback({ error, componentStack }: ErrorFallbackProps) {
  const { t } = useTranslation('global')
  const isDevelopment = import.meta.env.VITE_ENVIRONMENT === 'development'

  return (
    <main className="mx-auto max-w-2xl px-6 py-14">
      <section role="alert" className="panel space-y-5">
        <h1>{t('error.title')}</h1>
        <p>{t('error.description')}</p>
        <a href="/" className="button">
          {t('navigation.returnHome')}
        </a>
        {isDevelopment && error && (
          <details open className="rounded-xl border border-line p-4">
            <summary className="cursor-pointer font-semibold">
              {t('error.developmentDetails')}
            </summary>
            <pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap wrap-break-word text-sm">
              {error.stack ?? error.message}
            </pre>
            {componentStack && (
              <>
                <h2 className="mt-4 text-sm font-semibold">
                  {t('error.componentStack')}
                </h2>
                <pre className="mt-2 max-h-80 overflow-auto whitespace-pre-wrap wrap-break-word text-sm">
                  {componentStack}
                </pre>
              </>
            )}
          </details>
        )}
      </section>
    </main>
  )
}

type ErrorBoundaryState = {
  hasError: boolean
  error: Error | null
  componentStack: string | null
}

export class ErrorBoundary extends Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    componentStack: null,
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Application render error:', error, info.componentStack)
    this.setState({ componentStack: info.componentStack ?? null })
  }

  render() {
    const { hasError, error, componentStack } = this.state

    return hasError ? (
      <ErrorFallback error={error} componentStack={componentStack} />
    ) : (
      this.props.children
    )
  }
}
