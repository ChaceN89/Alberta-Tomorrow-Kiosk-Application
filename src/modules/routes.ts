/**
  File: routes.ts | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Build the canonical overview, activity, and exploration URLs for modules.

  Usage:
  - Shared navigation and preload logic use these route helpers.

  Notes:
  - Module IDs remain stable while the public route structure evolves.
 */
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

export function getModuleExplorePath(moduleId: string) {
  return `${moduleRouteBase(moduleId)}/explore`
}
