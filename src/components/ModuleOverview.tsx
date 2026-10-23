/**
 * File: ModuleOverview.tsx | Author: Chace Nielson
 * Created: 2026-10-23 | Updated: 2026-10-23
 * Description: Show reusable module details and navigation before launch.
 * Dependencies: React Router, react-i18next, learning-module metadata.
 */
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { useModulePreload } from '../modules/useModulePreload'
import type { LearningModule } from '../modules/types'

type ModuleOverviewProps = {
  module: LearningModule
}

export function ModuleOverview({ module }: ModuleOverviewProps) {
  const { t } = useTranslation(module.translationNamespace)
  const { t: tHome } = useTranslation('home')
  const { t: tGlobal } = useTranslation('global')
  const { state, preloadModule, isModuleReady } = useModulePreload()
  const navigate = useNavigate()
  const activityPath = `/modules/${module.id}/activity`
  const isReady = isModuleReady(module.id)
  const hasError = state.moduleId === module.id && state.status === 'error'
  const isPreparing = !isReady && !hasError

  useEffect(() => {
    void preloadModule(module)
  }, [module, preloadModule])

  return (
    <section
      aria-labelledby="module-title"
      aria-busy={isPreparing}
      className="max-w-3xl space-y-6"
    >
      <p className="font-semibold text-pine">{t('category')}</p>
      <h1 id="module-title">{t('title')}</h1>
      <p className="text-lg text-muted">{t('description')}</p>
      <p className="text-muted">{t('overviewDescription')}</p>
      {isPreparing && (
        <p role="status" className="text-muted">
          {tGlobal('preload.preparing')}
        </p>
      )}
      {hasError && (
        <div role="alert" className="panel space-y-3">
          <p className="font-semibold">{tGlobal('preload.errorTitle')}</p>
          <p className="text-muted">{tGlobal('preload.errorDescription')}</p>
          <button
            type="button"
            className="button-secondary"
            onClick={() => void preloadModule(module)}
          >
            {tGlobal('preload.retry')}
          </button>
        </div>
      )}
      <div className="panel space-y-4">
        <p className="font-medium text-muted">
          {tHome('moduleDuration', { count: module.estimatedMinutes })}
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="button"
            aria-label={t('launch')}
            disabled={!isReady}
            onClick={() => navigate(activityPath)}
          >
            <span
              aria-hidden="true"
              className={`mr-2 inline-flex h-5 items-center overflow-hidden transition-[width,margin] duration-300 motion-reduce:transition-none ${
                isPreparing ? 'w-5' : 'mr-0 w-0'
              }`}
            >
              <span className="size-5 shrink-0 animate-spin rounded-full border-2 border-white/40 border-t-white motion-reduce:animate-none" />
            </span>
            <span
              aria-hidden="true"
              className={`overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-300 motion-reduce:transition-none ${
                isPreparing ? 'max-w-0 opacity-0' : 'max-w-[40ch] opacity-100'
              }`}
            >
              {t('launch')}
            </span>
          </button>
          <Link className="button-secondary" to="/">
            {tGlobal('navigation.returnHome')}
          </Link>
        </div>
      </div>
    </section>
  )
}
