/**
 * File: ModulePage.tsx | Author: Chace Nielson
 * Created: 2026-10-23 | Updated: 2026-10-23
 * Description: Resolve module IDs and load activities only when requested.
 * Dependencies: React Suspense, React Router, module registry.
 */
import { Suspense } from 'react'
import { useParams } from 'react-router-dom'
import { Loading } from '../components/Loading'
import { NotFound } from '../components/NotFound'
import { modules } from '../modules/registry'

export function ModulePage() {
  const { moduleId } = useParams()
  const module = modules.find((entry) => entry.id === moduleId)

  if (!module) {
    return <NotFound />
  }

  const Activity = module.component

  return (
    <Suspense fallback={<Loading />}>
      <Activity key={module.id} />
    </Suspense>
  )
}
