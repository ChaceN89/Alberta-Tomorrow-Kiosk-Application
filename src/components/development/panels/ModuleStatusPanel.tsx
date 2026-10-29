/**
  File: ModuleStatusPanel.tsx | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Show preload status and progress for every registered module.

  Usage:
  - Shared and app-state UI is imported by app or feature flows.

  Notes:
  - None.
 */
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import type { ModulePreloadState } from '@/modules/useModulePreload'
import { useModulePreload } from '@/modules/useModulePreload'
import { visibleModules } from '@/modules/registry'
import type { LearningModule } from '@/modules/types'
import { DevPanel } from './DevPanel'

type ModuleStatusPanelProps = {
  preloadState: ModulePreloadState
  onClose: () => void
}

type ModuleStatusItemProps = {
  module: LearningModule
  preloadState: ModulePreloadState
  onClose: () => void
}

function ModuleStatusItem({
  module,
  preloadState,
  onClose,
}: ModuleStatusItemProps) {
  const { t } = useTranslation('development')
  const { t: tModule } = useTranslation(module.translationNamespace)
  const { isModuleReady, preloadModule } = useModulePreload()
  const isCurrent = preloadState.moduleId === module.id
  const status = isCurrent
    ? preloadState.status
    : isModuleReady(module.id)
      ? 'ready'
      : 'idle'
  const title = tModule('title')
  const progress = isCurrent
    ? preloadState.progress
    : status === 'ready'
      ? 100
      : 0
  const statusLabel =
    status === 'idle'
      ? t('status.idle')
      : status === 'loading'
        ? t('status.loading')
        : status === 'ready'
          ? t('status.ready')
          : t('status.error')

  return (
    <li className="rounded-xl border border-line p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-muted">
            {statusLabel}
            {status === 'loading' && ` · ${progress}%`}
          </p>
        </div>
        <button
          type="button"
          className="button-secondary min-h-10 shrink-0 px-3 py-2 text-sm"
          disabled={status === 'ready' || status === 'loading'}
          onClick={() => void preloadModule(module)}
        >
          {t(
            status === 'error'
              ? 'retryModule'
              : status === 'ready'
                ? 'moduleReady'
                : 'loadModule',
          )}
        </button>
      </div>
      {status === 'loading' && (
        <div
          role="progressbar"
          aria-label={t('moduleProgress', { name: title })}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          className="mt-3 h-2 overflow-hidden rounded-full bg-line"
        >
          <div
            className="h-full bg-pine transition-[width] duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        <Link
          className="button-secondary min-h-10 px-3 py-2 text-sm"
          to={`/modules/${module.id}`}
          onClick={onClose}
        >
          {t('moduleOverview')}
        </Link>
        <Link
          className="button min-h-10 px-3 py-2 text-sm"
          to={`/modules/${module.id}/expedition`}
          onClick={onClose}
        >
          {t('moduleActivity')}
        </Link>
      </div>
    </li>
  )
}

export function ModuleStatusPanel({
  preloadState,
  onClose,
}: ModuleStatusPanelProps) {
  const { t } = useTranslation('development')

  return (
    <DevPanel title={t('modules')} onClose={onClose}>
      <p className="mb-3 text-sm text-muted">{t('modulesDescription')}</p>
      <ul className="space-y-2">
        {visibleModules.map((module) => (
          <ModuleStatusItem
            key={module.id}
            module={module}
            preloadState={preloadState}
            onClose={onClose}
          />
        ))}
      </ul>
    </DevPanel>
  )
}
