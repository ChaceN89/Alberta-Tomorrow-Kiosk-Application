/**
  File: ModuleActivity.tsx | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Preload the selected activity and show loading or retry UI as needed.
  - Render the expedition once its activity component is ready.

  Usage:
  - Rendered by ModulePage for a module's expedition route.

  Notes:
  - None.
 */
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Loading } from '@/components/app-states/Loading'
import { getModuleExplorePath } from '@/modules/routes'
import { useModulePreload } from '@/modules/useModulePreload'
import { ExpeditionActivity } from './ExpeditionActivity'
import type { ModuleActivityProps } from './types'

export function ModuleActivity({ module }: ModuleActivityProps) {
  const { t } = useTranslation('global')
  const { state, preloadModule, isModuleReady } = useModulePreload()

  useEffect(() => {
    void preloadModule(module)
  }, [module, preloadModule])

  if (!isModuleReady(module.id)) {
    if (state.moduleId === module.id && state.status === 'error') {
      return (
        <section role="alert" className="panel max-w-3xl space-y-4">
          <h1>{t('preload.errorTitle')}</h1>
          <p className="text-muted">{t('preload.errorDescription')}</p>
          <button
            type="button"
            className="button-secondary"
            onClick={() => void preloadModule(module)}
          >
            {t('preload.retry')}
          </button>
        </section>
      )
    }

    return <Loading label={t('preload.preparing')} />
  }

  return (
    <div className="space-y-6">
      <Link className="button-secondary" to={getModuleExplorePath(module.id)}>
        {t('explore.openActivity')}
      </Link>
      <ExpeditionActivity module={module} />
    </div>
  )
}
