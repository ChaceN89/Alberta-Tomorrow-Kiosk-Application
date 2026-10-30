/**
  File: ExploreMap.tsx | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Route the shared explore page to the default or selected module map.

  Usage:
  - Rendered by /explore and /expeditions/:moduleId/explore.

  Notes:
  - Map rendering and module map details live in src/mapping.
 */
import { ModuleNotFound } from '@/components/modules/ModuleNotFound'
import { BaseExploreMap } from '@/mapping/BaseExploreMap'
import { ModuleExploreMap } from '@/mapping/ModuleExploreMap'
import { visibleModules } from '@/modules/registry'
import { Navigate, useParams } from 'react-router-dom'
import { getModuleActivityPath } from '@/modules/routes'

export function ExploreMap() {
  const { moduleId } = useParams()

  // If no moduleId is provided in the URL, render the base explore map. default settings for the map
  if (!moduleId) {
    return <BaseExploreMap />
  }

  // else the moduleId is provided, find the corresponding module and render the map with the modules specific settings
  const module = visibleModules.find((entry) => entry.id === moduleId)

  // not found if the module isnt in the visibleModules registry
  if (!module) {
    return <ModuleNotFound />
  }

  if (!module.map) {
    return <Navigate to={getModuleActivityPath(module.id)} replace />
  }

  // module found, render the module explore map with the module's specific settings
  return <ModuleExploreMap module={module} />
}
