/**
 * File: ModulePage.tsx | Author: Chace Nielson
 * Created: 2026-10-23 | Updated: 2026-10-23
 * Description: Render module details and load activities only when requested.
 * Dependencies: React Suspense, React Router, module registry, journal context.
 */
import { Suspense, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { Loading } from '../components/Loading'
import { ModuleOverview } from '../components/ModuleOverview'
import { ModuleNotFound } from '../components/ModuleNotFound'
import { useJournal } from '../journal/useJournal'
import { useModulePreload } from '../modules/useModulePreload'
import { modules } from '../modules/registry'
import type { LearningModule } from '../modules/types'

type ModuleActivityProps = {
  module: LearningModule
}

function ModuleActivity({ module }: ModuleActivityProps) {
  const { t } = useTranslation('global')
  const { state, preloadModule, isModuleReady } = useModulePreload()
  const { completeCheckpoint, getCompletedCheckpoints } = useJournal()
  const recordCheckpoint = useCallback(
    (checkpointId: string) => completeCheckpoint(module.id, checkpointId),
    [completeCheckpoint, module.id],
  )

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

  const Activity = module.component

  return (
    <Suspense fallback={<Loading />}>
      <Activity
        key={module.id}
        completedCheckpoints={getCompletedCheckpoints(module.id)}
        completeCheckpoint={recordCheckpoint}
      />
    </Suspense>
  )
}

export function ModulePage() {
  const { moduleId, '*': modulePath } = useParams()
  const module = modules.find((entry) => entry.id === moduleId)

  if (!module) {
    return <ModuleNotFound />
  }

  if (!modulePath) {
    return <ModuleOverview module={module} />
  }

  if (modulePath !== 'activity') {
    return <ModuleNotFound />
  }

  return <ModuleActivity module={module} />
}
