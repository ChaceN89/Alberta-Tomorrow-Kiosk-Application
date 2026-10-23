/**
 * File: types.ts | Author: Chace Nielson
 * Created: 2026-10-23 | Updated: 2026-10-23
 * Description: Define the metadata contract for independent learning modules.
 * Dependencies: React types and the English translation key structure.
 */
import type { ComponentType, LazyExoticComponent } from 'react'
import type en from '../locales/en/translation.json'

type ModuleKey = Exclude<keyof typeof en.modules, 'duration'>

export interface LearningModule {
  id: string
  titleKey: `modules.${ModuleKey}.title`
  descriptionKey: `modules.${ModuleKey}.description`
  category: keyof typeof en.categories
  estimatedMinutes: number
  component: LazyExoticComponent<ComponentType>
}
