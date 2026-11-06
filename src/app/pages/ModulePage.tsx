/**
  File: ModulePage.tsx | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Render module details and route each module to its configured start destination.

  Usage:
  - App route pages are rendered by the router.

  Notes:
  - None.
 */
import { Navigate, useParams } from 'react-router-dom'
import { ModuleNotFound } from '@/components/modules/ModuleNotFound'
import { ModuleOverview } from '@/components/modules/ModuleOverview'
import { visibleModules } from '@/modules/registry'
import { ModuleActivity } from './module/ModuleActivity'
import {
  getModuleActivityExplorePath,
  getModuleEnvironmentPath,
} from '@/modules/routes'
import { ModuleEnvironmentPage } from './module/ModuleEnvironmentPage'

export function ModulePage() {
  const { moduleId, '*': modulePath } = useParams()
  const module = visibleModules.find((entry) => entry.id === moduleId)

  // if no module is found, render the not found component
  if (!module) {
    return <ModuleNotFound />
  }

  // if no specific path is provided, render the module overview
  if (!modulePath) {
    return <ModuleOverview module={module} />
  }

  // if the module path is not recognized, render the not found component
  if (modulePath === 'environment') {
    return module.startDestination === 'environment' ? (
      <ModuleEnvironmentPage module={module} />
    ) : (
      <ModuleNotFound />
    )
  }

  if (modulePath !== 'activity') {
    return <ModuleNotFound />
  }

  if (module.startDestination === 'map') {
    return <Navigate to={getModuleActivityExplorePath(module.id)} replace />
  }

  if (module.startDestination === 'environment') {
    return <Navigate to={getModuleEnvironmentPath(module.id)} replace />
  }

  return <ModuleActivity module={module} />
}
