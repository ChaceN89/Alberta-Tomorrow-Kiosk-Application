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
import { DefaultExploreMap } from '@/mapping/DefaultExploreMap'
import { ModuleExploreMap } from '@/mapping/ModuleExploreMap'
import { visibleModules } from '@/modules/registry'
import { useParams } from 'react-router-dom'

export function ExploreMap() {
  const { moduleId } = useParams()

  if (!moduleId) {
    return <DefaultExploreMap />
  }

  const module = visibleModules.find((entry) => entry.id === moduleId)

  if (!module) {
    return <ModuleNotFound />
  }

  return <ModuleExploreMap module={module} />
}
