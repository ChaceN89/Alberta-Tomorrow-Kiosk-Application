/**
  File: routes.ts | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Build the canonical overview, start, activity, environment, and map URLs.

  Usage:
  - Shared navigation and preload logic use these route helpers.

  Notes:
  - Module IDs remain stable while the public route structure evolves.
 */
import type { ModuleStartDestination } from './types'

function moduleRouteBase(moduleId: string) {
  return `/expeditions/${encodeURIComponent(moduleId)}`
}

export function getModuleOverviewPath(moduleId: string) {
  return moduleRouteBase(moduleId)
}

export function getModuleActivityPath(moduleId: string) {
  return `${moduleRouteBase(moduleId)}/activity`
}

export function getModuleActivityExplorePath(moduleId: string) {
  return `${getModuleActivityPath(moduleId)}/explore`
}

export function getModuleEnvironmentPath(moduleId: string) {
  return `${moduleRouteBase(moduleId)}/environment`
}

export function getModuleStartPath(
  moduleId: string,
  startDestination: ModuleStartDestination,
) {
  if (startDestination === 'map') {
    return getModuleActivityExplorePath(moduleId)
  }
  if (startDestination === 'environment') {
    return getModuleEnvironmentPath(moduleId)
  }
  return getModuleActivityPath(moduleId)
}

export function getModuleExplorePath(moduleId: string) {
  return `${moduleRouteBase(moduleId)}/explore`
}
