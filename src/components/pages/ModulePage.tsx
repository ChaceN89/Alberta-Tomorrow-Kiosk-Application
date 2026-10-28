/**
 * File: ModulePage.tsx | Author: Chace Nielson
 * Created: 2026-10-23 | Updated: 2026-10-28
 * Description: Render module details and load activities only when requested.
 * Dependencies: React Suspense, React Router, module views, journal and preload contexts.
 */
import { Suspense, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { Loading } from '../app-states/Loading'
import { ModuleNotFound } from '../modules/ModuleNotFound'
import { ModuleOverview } from '../modules/ModuleOverview'
import { useJournal } from '../../journal/useJournal'
import { useModulePreload } from '../../modules/useModulePreload'
import { modules } from '../../modules/registry'
import type { LearningModule } from '../../modules/types'

type ModuleActivityProps = {
  module: LearningModule
}

function ExpeditionActivity({ module }: ModuleActivityProps) {
  const { startExpedition, completeCheckpoint, getCompletedCheckpoints } =
    useJournal()
  const recordCheckpoint = useCallback(
    (checkpointId: string) => completeCheckpoint(module.id, checkpointId),
    [completeCheckpoint, module.id],
  )
  const Activity = module.component

  useEffect(() => {
    startExpedition(module.id)
  }, [module.id, startExpedition])

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

function ModuleActivity({ module }: ModuleActivityProps) {
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

  return <ExpeditionActivity module={module} />
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

  if (modulePath !== 'expedition') {
    return <ModuleNotFound />
  }

  return <ModuleActivity module={module} />
}
