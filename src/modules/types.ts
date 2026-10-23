/**
 * File: types.ts | Author: Chace Nielson
 * Created: 2026-10-23 | Updated: 2026-10-23
 * Description: Define metadata and locale namespace types for learning modules.
 * Dependencies: React component and lazy-loading types.
 */
import type { ComponentType, LazyExoticComponent } from 'react'

export type ModuleTranslationNamespace = 'residentialSchool' | 'wildlifeFinder'

export type ModuleActivityLoader = () => Promise<{ default: ComponentType }>

export type ModulePreloadContext = {
  signal: AbortSignal
  onProgress: (progress: number) => void
}

export type ModulePreloader = (context: ModulePreloadContext) => Promise<void>

export interface LearningModule {
  id: string
  translationNamespace: ModuleTranslationNamespace
  estimatedMinutes: number
  component: LazyExoticComponent<ComponentType>
  loadActivity: ModuleActivityLoader
  preload?: ModulePreloader
}
