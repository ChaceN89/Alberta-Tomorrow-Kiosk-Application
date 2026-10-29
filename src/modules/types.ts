/**
  File: types.ts | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Define metadata and locale namespace types for learning modules.

  Usage:
  - Module support files are imported by module flows.

  Notes:
  - None.
 */
import type { ComponentType, LazyExoticComponent } from 'react'

export type ModuleTranslationNamespace =
  'geology' | 'residentialSchool' | 'wildlifeFinder'

export type ModuleCheckpointProps = {
  completedCheckpoints: readonly string[]
  completeCheckpoint: (checkpointId: string) => void
}

export type ModuleActivityProps = ModuleCheckpointProps & {
  moduleId: string
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

export type JournalEntryActionProps = {
  entryId: string
  moduleId: string
}

export interface LearningModule {
  visible: boolean
  id: string
  translationNamespace: ModuleTranslationNamespace
  estimatedMinutes: number
  checkpoints: readonly string[]
  component: LazyExoticComponent<ModuleActivityComponent>
  journalEntryImages?: Readonly<Record<string, string>>
  journalEntryAction?: LazyExoticComponent<
    ComponentType<JournalEntryActionProps>
  >
  loadActivity: ModuleActivityLoader
  preload?: ModulePreloader
}
