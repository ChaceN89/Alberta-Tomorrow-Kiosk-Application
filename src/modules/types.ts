/**
  File: types.ts | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Define module metadata, launch settings, map POIs, and activity contracts.

  Usage:
  - Module support files are imported by module flows.

  Notes:
  - None.
 */
import type { ComponentType, LazyExoticComponent } from 'react'
import type { ParseKeys } from 'i18next'
import type {
  ImageViewerContent,
  MessageViewerContent,
  ModelViewerContent,
} from '@/module-tools/media-viewer/provider/types'
import type { MediaTrack } from '@/module-tools/media-player/provider/types'
import type { ModuleIconComponent } from '@/components/icons/module-icons/types'

export type ModuleTranslationNamespace =
  'frankSlide' | 'geology' | 'residentialSchool' | 'wildlifeFinder'

export type MapPoiTranslationNamespace = 'mapping' | ModuleTranslationNamespace

export type MapPoiView = {
  center: [number, number]
  zoom: number
  pitch: number
  bearing: number
}

export type MapPoiDefinition = {
  id: string
  coordinates: [number, number]
  titleKey: ParseKeys<MapPoiTranslationNamespace>
  titleNamespace?: MapPoiTranslationNamespace
  view?: MapPoiView
}

export type ModuleStartDestination = 'activity' | 'environment' | 'map'

export type ModuleInfo = {
  icon: ModuleIconComponent
  translationNamespace: ModuleTranslationNamespace
  titleKey: 'title'
  descriptionKey: 'description'
  estimatedMinutes: number
}

export type ModuleSettings = ModuleInfo & {
  startDestination: ModuleStartDestination
  journalImage: string
}

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

export type JournalEntryMedia =
  | { type: 'track'; track: MediaTrack }
  | {
      type: 'image'
      src: string
      viewer?: Omit<ImageViewerContent, 'src'>
      thumbnail?: string
    }
  | {
      type: 'message'
      content: MessageViewerContent
      thumbnail?: string
    }
  | {
      type: 'model'
      content: ModelViewerContent
      thumbnail?: string
    }

export type JournalEntryDefinition = {
  media: readonly JournalEntryMedia[]
}

export type ModuleMapPoi = MapPoiDefinition & {
  checkpointId: string
  additionalCompletionCheckpoints?: readonly string[]
}

export type ModuleMapStartup = {
  view: MapPoiView
  startFlyover?: boolean
}

export type ModuleMapSettings = {
  defaultPoisVisible?: boolean
  modulePoisVisible?: boolean
  activityMapLinkPlacement?: 'outsideActivity' | 'insideActivity'
  startup?: ModuleMapStartup
}

export type ModuleMapPoiContentProps = {
  onComplete: (checkpointId: string) => void
}

export type ModuleMap = {
  settings: ModuleMapSettings
  pois: readonly ModuleMapPoi[]
  poiContent?: Readonly<Record<string, ComponentType<ModuleMapPoiContentProps>>>
}

export interface LearningModule {
  visible: boolean
  id: string
  icon: ModuleInfo['icon']
  translationNamespace: ModuleInfo['translationNamespace']
  titleKey: ModuleInfo['titleKey']
  descriptionKey: ModuleInfo['descriptionKey']
  estimatedMinutes: ModuleInfo['estimatedMinutes']
  startDestination: ModuleSettings['startDestination']
  journalImage: ModuleSettings['journalImage']
  // section for journal entry initia limge here - descriptionIMg can get set
  checkpoints: readonly string[]
  map?: ModuleMap
  activityPage?: LazyExoticComponent<ModuleActivityComponent>
  journalEntries: Readonly<Record<string, JournalEntryDefinition>>
  loadActivityPage?: ModuleActivityLoader
  preload?: ModulePreloader
}

export type ModuleDefinition = Omit<LearningModule, 'id' | 'visible'>
