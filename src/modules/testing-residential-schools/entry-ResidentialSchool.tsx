/**
  File: entry-ResidentialSchool.tsx | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Route this map-focused activity to its residential-school map.

  Usage:
  - Registered activity components are lazy-loaded by the module registry.

  Notes:
  - None.
 */
import { Navigate } from 'react-router-dom'
import { getModuleActivityExplorePath } from '@/modules/routes'
import type { ModuleActivityProps } from '@/modules/types'

export default function ResidentialSchool({ moduleId }: ModuleActivityProps) {
  return <Navigate to={getModuleActivityExplorePath(moduleId)} replace />
}
