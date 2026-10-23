/**
 * File: types.ts | Author: Chace Nielson
 * Created: 2026-10-23 | Updated: 2026-10-23
 * Description: Define metadata and locale namespace types for learning modules.
 * Dependencies: React component and lazy-loading types.
 */
import type { ComponentType, LazyExoticComponent } from 'react'

export type ModuleTranslationNamespace =
  'geology' | 'residentialSchool' | 'wildlifeFinder'

export type ModuleActivityProps = {
  completedCheckpoints: readonly string[]
  completeCheckpoint: (checkpointId: string) => void
}

export type ModuleActivityComponent = ComponentType<ModuleActivityProps>

export type ModuleActivityLoader = () => Promise<{
  default: ModuleActivityComponent
}>

export type ModulePreloadContext = {
  signal: AbortSignal
  onProgress: (progress: number) => void
}

export type ModulePreloader = (context: ModulePreloadContext) => Promise<void>

export interface LearningModule {
  id: string
  translationNamespace: ModuleTranslationNamespace
  estimatedMinutes: number
  checkpoints: readonly string[]
  component: LazyExoticComponent<ModuleActivityComponent>
  loadActivity: ModuleActivityLoader
  preload?: ModulePreloader
}
