/**
  File: ExpeditionActivity.tsx | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Start the selected expedition and connect its activity to journal progress.
  - Suspend activity rendering until its lazy-loaded component is available.

  Usage:
  - Rendered by ModuleActivity after the selected activity is ready.

  Notes:
  - None.
 */
import { Suspense, useCallback, useEffect } from 'react'
import { Loading } from '@/components/app-states/Loading'
import { useExpeditionProgress } from '@/save-data/expedition-progress'
import type { ModuleActivityComponent } from '@/modules/types'
import type { ModuleActivityProps } from './types'

type ExpeditionActivityRunnerProps = ModuleActivityProps & {
  Activity: ModuleActivityComponent
}

export function ExpeditionActivity({
  module,
  Activity,
}: ExpeditionActivityRunnerProps) {
  // extract journal functions for managing expedition progress
  const { startExpedition, completeCheckpoint, getCompletedCheckpoints } =
    useExpeditionProgress()

  // create a callback to record checkpoint completion for the current module
  const recordCheckpoint = useCallback(
    (checkpointId: string) => completeCheckpoint(module.id, checkpointId),
    [completeCheckpoint, module.id],
  )

  // start the expedition for the current module when the component mounts
  useEffect(() => {
    startExpedition(module.id)
  }, [module.id, startExpedition])

  // render the lazy-loaded activity component within a suspense boundary
  // The module activity page supplies the module-specific learner experience.
  return (
    <Suspense fallback={<Loading />}>
      <Activity
        key={module.id}
        moduleId={module.id}
        completedCheckpoints={getCompletedCheckpoints(module.id)}
        completeCheckpoint={recordCheckpoint}
      />
    </Suspense>
  )
}
